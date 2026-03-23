from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GameNight
from .serializers import GameNightSerializer


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "gamesnight-api"})


class GameNightViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GameNightSerializer

    def get_queryset(self):
        queryset = GameNight.objects.all()
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
