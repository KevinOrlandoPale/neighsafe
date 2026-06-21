from django.shortcuts import render
from rest_framework import generics
from rest_framework.generics import RetrieveAPIView
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser


User = get_user_model()

class UserProfileView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        

class UserProfileView(generics.RetrieveAPIView):

    queryset = User.objects.all()

    serializer_class = UserSerializer

    permission_classes = [IsAuthenticated]


class UpdateProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        user = request.user

        # NÃO ALTERA NOME

        user.city = request.data.get(
            "city",
            user.city
        )

        user.bio = request.data.get(
            "bio",
            user.bio
        )

        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]

        user.save()

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "city": user.city,
            "bio": user.bio,
            "avatar": (
                user.avatar.url
                if user.avatar
                else None
            )
        })