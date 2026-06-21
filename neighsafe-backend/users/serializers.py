from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    username_field = "email"

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        token["is_authority"] = (
            user.is_authority
        )

        token["station_name"] = (
            user.station_name
        )

        return token


    def validate(self, attrs):

        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "is_authority": self.user.is_authority,
            "station_name": self.user.station_name,
        }

        return data


class RegisterSerializer(
    serializers.ModelSerializer
):

    password = (
        serializers.CharField(
            write_only=True
        )
    )

    class Meta:

        model = User

        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
        ]

    def create(
        self,
        validated_data
    ):

        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get(
                "first_name",
                ""
            ),
            last_name=validated_data.get(
                "last_name",
                ""
            )
        )


class UserSerializer(
    serializers.ModelSerializer
):

    alerts_count = (
        serializers.SerializerMethodField()
    )

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
            "is_authority",
            "station_name",
        ]

    def get_alerts_count(
        self,
        obj
    ):

        return obj.alerts.count()