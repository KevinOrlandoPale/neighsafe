from django.urls import path
from .views import AlertListCreateView, AlertDetailView

urlpatterns = [
    path("", AlertListCreateView.as_view()),
    path("<int:pk>/", AlertDetailView.as_view()),
]