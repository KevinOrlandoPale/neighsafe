from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)

User = get_user_model()

# 1. Login Customizado (Retorna tokens + dados do utilizador como is_authority)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# 2. Registo de Novos Utilizadores
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# 3. Obter os dados do próprio utilizador logado
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# 4. Obter o perfil de qualquer utilizador pelo ID
class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# 5. Atualizar o próprio perfil
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    # IMPORTANTE: Isto é obrigatório para receber ficheiros (avatar) do Frontend
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user = request.user

        # NÃO ALTERA NOME
        user.city = request.data.get("city", user.city)
        user.bio = request.data.get("bio", user.bio)

        # Atualiza a foto se ela for enviada no pedido
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]

        user.save()

        # Prepara a resposta garantindo que a URL da imagem é absoluta (com http://...)
        avatar_url = request.build_absolute_uri(user.avatar.url) if user.avatar else None

        return Response({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "city": user.city,
            "bio": user.bio,
            "avatar": avatar_url
        })