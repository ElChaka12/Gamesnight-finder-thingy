from rest_framework import serializers

from .models import GameNight


class GameNightSerializer(serializers.ModelSerializer):
    available_spots = serializers.IntegerField(read_only=True)
    skill_level_label = serializers.CharField(
        source="get_skill_level_display",
        read_only=True,
    )

    class Meta:
        model = GameNight
        fields = [
            "id",
            "title",
            "game_title",
            "description",
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
        ]
