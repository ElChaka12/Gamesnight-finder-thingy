from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import GameNight


class GameNightApiTests(APITestCase):
    def setUp(self):
        now = timezone.now()
        GameNight.objects.create(
            title="Library Lounge Social",
            game_title="Catan",
            description="Casual strategy session for new and returning players.",
            host_name="Maya",
            campus_name="North Campus",
            venue="Library Lounge",
            starts_at=now + timedelta(days=1),
            ends_at=now + timedelta(days=1, hours=3),
            skill_level=GameNight.MIXED,
            spots_total=6,
            spots_taken=3,
            is_featured=True,
            contact_link="https://example.com/signup",
        )

    def test_health_check(self):
        response = self.client.get(reverse("health-check"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

    def test_game_night_list_includes_created_event(self):
        response = self.client.get(reverse("game-night-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        game_titles = {game_night["game_title"] for game_night in response.json()}

        self.assertIn("Catan", game_titles)
