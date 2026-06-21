from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        # Executa a validação padrão para gerar os tokens (access e refresh)
        data = super().validate(attrs)
        
        # Adiciona dados extra diretamente na resposta de login
        data['is_authority'] = self.user.is_authority
        data['station_name'] = self.user.station_name
        
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Opcional: Adiciona as claims dentro do próprio token JWT decodificável
        token['is_authority'] = user.is_authority
        token['station_name'] = user.station_name
        return token

    # No teu serializers.py dentro do CustomTokenObtainPairSerializer
    def validate(self, attrs):
        # Debug: Printa para o terminal do servidor
        print(f"Tentativa de login para: {attrs.get('email')}")
        
        try:
            data = super().validate(attrs)
        except Exception as e:
            print(f"Erro na validação: {e}")
            raise e
            
        data['is_authority'] = self.user.is_authority
        data['station_name'] = self.user.station_name
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    alerts_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "bio",
            "city",
            "avatar",
            "alerts_count",
            # NOVOS CAMPOS ADICIONADOS AQUI:
            "is_authority",
            "station_name"
        ]

    def get_alerts_count(self, obj):
        return obj.alerts.count()