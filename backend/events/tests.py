from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import GameNight

User = get_user_model()


class GameNightApiTests(APITestCase):
    def setUp(self):
        now = timezone.now()
        self.user = User.objects.create_user(username="maya", password="boardgames123")
        self.other_user = User.objects.create_user(username="leo", password="meeples123")
        self.token = Token.objects.create(user=self.user)

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

    def test_register_returns_token(self):
        response = self.client.post(
            reverse("auth-register"),
            {
                "username": "newstudent",
                "password": "gameboards123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.json())
        self.assertEqual(response.json()["user"]["username"], "newstudent")

    def test_login_returns_token(self):
        response = self.client.post(
            reverse("auth-login"),
            {
                "username": "maya",
                "password": "boardgames123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.json())

    def test_authenticated_user_can_create_game_night(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.post(
            reverse("game-night-list"),
            {
                "title": "Study Break Showdown",
                "game_title": "Exploding Kittens",
                "description": "A quick, casual game night between revision blocks.",
                "campus_name": "North Campus",
                "venue": "Union Cafe",
                "starts_at": (timezone.now() + timedelta(days=2)).isoformat(),
                "ends_at": (timezone.now() + timedelta(days=2, hours=2)).isoformat(),
                "skill_level": GameNight.BEGINNER,
                "spots_total": 8,
                "contact_link": "https://example.com/study-break-showdown",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["host_name"], "maya")
        self.assertTrue(GameNight.objects.filter(title="Study Break Showdown").exists())

    def test_authenticated_user_can_join_existing_game_night(self):
        game_night = GameNight.objects.create(
            title="Friday Night Draft",
            game_title="7 Wonders",
            description="A strategy session for students who want a faster competitive table.",
            host=self.other_user,
            host_name=self.other_user.username,
            campus_name="Arts Campus",
            venue="Student Centre",
            starts_at=timezone.now() + timedelta(days=3),
            ends_at=timezone.now() + timedelta(days=3, hours=2),
            skill_level=GameNight.MIXED,
            spots_total=5,
            spots_taken=2,
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.post(reverse("game-night-join", args=[game_night.pk]))

        game_night.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(game_night.spots_taken, 3)
        self.assertTrue(game_night.participants.filter(pk=self.user.pk).exists())
