from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    subtitle = serializers.SerializerMethodField()
    comments = serializers.SerializersMethodField()

    class Meta:
        model = Alert
        fields = [
            'id',
            'title', 
            'subtitle', 
            'description', 
            'comments',  
            'views', 
        ]

    def get_subtitle(self, obj):
        return f"{obj.location} - {obj.created_at.strftime('%d/%m/%Y')}"
        return f"{obj.location} • {time_ago}"

        def get_comments(self, obj):
            return obj.comments.count()