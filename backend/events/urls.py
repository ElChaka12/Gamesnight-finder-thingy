from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GameNightViewSet, HealthCheckView

router = DefaultRouter()
router.register("game-nights", GameNightViewSet, basename="game-night")

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("", include(router.urls)),
]
