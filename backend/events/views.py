from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GameNight
from .serializers import (
    GameNightCreateSerializer,
    GameNightSerializer,
    RegisterSerializer,
    UserSummarySerializer,
)


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "gamesnight-api"})


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user": UserSummarySerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request=request, username=username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)

        return Response(
            {
                "token": token.key,
                "user": UserSummarySerializer(user).data,
            }
        )


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSummarySerializer(request.user).data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.auth:
            request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GameNightViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = GameNightSerializer

    def get_permissions(self):
        if self.action in {"create", "join"}:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.action == "create":
            return GameNightCreateSerializer
        return GameNightSerializer

    def get_queryset(self):
        queryset = GameNight.objects.select_related("host").prefetch_related("participants").all()
        campus = self.request.query_params.get("campus")
        skill_level = self.request.query_params.get("skill_level")
        featured = self.request.query_params.get("featured")

        if campus:
            queryset = queryset.filter(campus_name__icontains=campus)
        if skill_level:
            queryset = queryset.filter(skill_level=skill_level)
        if featured in {"1", "true", "yes"}:
            queryset = queryset.filter(is_featured=True)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        game_night = serializer.save()
        response_serializer = GameNightSerializer(
            game_night,
            context=self.get_serializer_context(),
        )
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def join(self, request, pk=None):
        with transaction.atomic():
            game_night = (
                GameNight.objects.select_for_update()
                .select_related("host")
                .get(pk=pk)
            )

            if game_night.host_id == request.user.pk:
                return Response(
                    {"detail": "You cannot join your own session."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if game_night.participants.filter(pk=request.user.pk).exists():
                return Response(
                    {"detail": "You have already joined this session."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if game_night.available_spots < 1:
                return Response(
                    {"detail": "This session is already full."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            game_night.participants.add(request.user)
            game_night.spots_taken += 1
            game_night.save(update_fields=["spots_taken", "updated_at"])

        game_night = self.get_queryset().get(pk=pk)
        serializer = GameNightSerializer(
            game_night,
            context=self.get_serializer_context(),
        )
        return Response(serializer.data)
