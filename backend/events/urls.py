from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CurrentUserView,
    GameNightViewSet,
    HealthCheckView,
    LoginView,
    LogoutView,
    RegisterView,
)

router = DefaultRouter()
router.register("game-nights", GameNightViewSet, basename="game-night")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("", include(router.urls)),
]
