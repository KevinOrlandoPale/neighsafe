from django.urls import (
    path,
    include
)

from rest_framework.routers import (
    DefaultRouter
)

from .views import (
    AlertViewSet,
    CommentViewSet
)


router = DefaultRouter()

router.register(
    "alerts",
    AlertViewSet,
    basename="alerts"
)

router.register(
    "comments",
    CommentViewSet,
    basename="comments"
)


urlpatterns = [

    path(
        "",
        include(
            router.urls
        )
    ),

]