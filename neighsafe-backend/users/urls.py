from django.urls import path
from .views import (
    RegisterView,
    MeView,
    CustomTokenObtainPairView,
    UserProfileView,
    UpdateProfileView,
)

urlpatterns = [
    path( "register/", RegisterView.as_view(), name="register"),
    path( "login/", CustomTokenObtainPairView.as_view(), name="login"),
    path( "me/", MeView.as_view(), name="me"),
    path( "users/<int:pk>/", UserProfileView.as_view(), name="user-profile"),
    path( "profile/update/", UpdateProfileView.as_view(), name="update-profile"),

]