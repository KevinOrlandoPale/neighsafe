from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlertViewSet
from .views import CommentViewSet



router = DefaultRouter()

router.register(
    r"comments",
    CommentViewSet,
    basename="comments"
)

router.register(
    "alerts",
    AlertViewSet,
    basename="alerts"
)


urlpatterns = [
    path("", include(router.urls)),
]