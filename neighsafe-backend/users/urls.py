from django.urls import path

from .views import (
    RegisterView,
    MeView,
    UserProfileView,
    UpdateProfileView,
    CustomTokenObtainPairView,
)

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view()
    ),

    path(
        "token/",
        CustomTokenObtainPairView.as_view()
    ),

    path(
        "me/",
        MeView.as_view()
    ),

    path(
        "users/<int:pk>/",
        UserProfileView.as_view()
    ),

    path(
        "profile/update/",
        UpdateProfileView.as_view()
    ),

]