from django.contrib import admin

from .models import GameNight


@admin.register(GameNight)
class GameNightAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "game_title",
        "host_name",
        "campus_name",
        "starts_at",
        "skill_level",
        "spots_total",
        "spots_taken",
        "is_featured",
    )
    list_filter = ("campus_name", "skill_level", "is_featured")
    search_fields = ("title", "game_title", "campus_name", "host_name", "venue")
    ordering = ("starts_at",)
    filter_horizontal = ("participants",)
