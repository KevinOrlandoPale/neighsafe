from django.utils.timesince import timesince
from django.utils.timezone import now
from rest_framework import serializers
from .models import Alert, Comment


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.email")

    class Meta:
        model = Comment
        fields = ["id", "text", "author_name"]


class AlertSerializer(serializers.ModelSerializer):
    subtitle = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Alert
        fields = [
            "id",
            "title",
            "subtitle",
            "description",
            "location",
            "comments",
            "views"
        ]

    def get_subtitle(self, obj):
    tempo = timesince(obj.created_at, now())

    # pega só a primeira parte (ex: "3 minutes")
    tempo = tempo.split(",")[0]

    return f"{obj.location} • há {tempo}"