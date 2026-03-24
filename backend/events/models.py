from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class GameNight(models.Model):
    BEGINNER = "beginner"
    MIXED = "mixed"
    COMPETITIVE = "competitive"

    SKILL_LEVEL_CHOICES = [
        (BEGINNER, "Beginner friendly"),
        (MIXED, "Mixed skill levels"),
        (COMPETITIVE, "Competitive table"),
    ]

    title = models.CharField(max_length=160)
    game_title = models.CharField(max_length=120)
    description = models.TextField()
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="hosted_game_nights",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    host_name = models.CharField(max_length=120)
    campus_name = models.CharField(max_length=120)
    venue = models.CharField(max_length=160)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    skill_level = models.CharField(
        max_length=20,
        choices=SKILL_LEVEL_CHOICES,
        default=MIXED,
    )
    spots_total = models.PositiveIntegerField(default=8)
    spots_taken = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    contact_link = models.URLField(blank=True)
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="joined_game_nights",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["starts_at", "title"]

    def __str__(self) -> str:
        return f"{self.title} ({self.campus_name})"

    @property
    def available_spots(self) -> int:
        return max(self.spots_total - self.spots_taken, 0)

    def clean(self) -> None:
        if self.starts_at >= self.ends_at:
            raise ValidationError("End time must be after the start time.")
        if self.spots_taken > self.spots_total:
            raise ValidationError("Spots taken cannot exceed total spots.")

    def save(self, *args, **kwargs):
        if self.host:
            self.host_name = self.host.username
        super().save(*args, **kwargs)
