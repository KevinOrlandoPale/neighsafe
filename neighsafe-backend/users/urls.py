from django.urls import path
from .views import RegisterView
from .views import MeView
from .views import RegisterView, MeView, CustomTokenObtainPairView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
]