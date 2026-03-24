from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import GameNight

User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class GameNightSerializer(serializers.ModelSerializer):
    available_spots = serializers.IntegerField(read_only=True)
    skill_level_label = serializers.CharField(
        source="get_skill_level_display",
        read_only=True,
    )
    host_username = serializers.CharField(source="host.username", read_only=True)
    is_joined = serializers.SerializerMethodField()
    is_host = serializers.SerializerMethodField()

    class Meta:
        model = GameNight
        fields = [
            "id",
            "title",
            "game_title",
            "description",
            "host_username",
            "host_name",
            "campus_name",
            "venue",
            "starts_at",
            "ends_at",
            "skill_level",
            "skill_level_label",
            "spots_total",
            "spots_taken",
            "available_spots",
            "is_featured",
            "contact_link",
            "is_joined",
            "is_host",
        ]

    def get_is_joined(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.participants.filter(pk=request.user.pk).exists()

    def get_is_host(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.host_id == request.user.pk


class GameNightCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameNight
        fields = [
            "title",
            "game_title",
            "description",
            "campus_name",
            "venue",
            "starts_at",
            "ends_at",
            "skill_level",
            "spots_total",
            "contact_link",
        ]

    def validate(self, attrs):
        if attrs["starts_at"] >= attrs["ends_at"]:
            raise serializers.ValidationError("End time must be after the start time.")
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        return GameNight.objects.create(
            host=request.user,
            host_name=request.user.username,
            spots_taken=0,
            **validated_data,
        )
