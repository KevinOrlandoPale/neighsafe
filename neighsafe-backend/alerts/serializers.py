from rest_framework import serializers
from django.utils.timesince import timesince
from django.utils.timezone import now

from .models import Alert, Comment


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source="author.id", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "text",
            "author",
            "author_id",
            "author_name",
            "created_at",
        ]
        read_only_fields = [
            "author",
            "author_id",
            "author_name",
            "created_at",
        ]

    def get_author_name(self, obj):
        if obj.author:
            # Fallback seguro: tenta username, se não tiver usa o prefixo do email, senão assume "Utilizador"
            return (
                obj.author.username 
                or getattr(obj.author, 'email', '').split('@')[0] 
                or "Utilizador"
            )
        return "Utilizador"


class AlertSerializer(serializers.ModelSerializer):
    subtitle = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source="author.id", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    # NOVOS CAMPOS CONTADORES
    confirmations_count = serializers.IntegerField(source="confirmations.count", read_only=True)
    false_reports_count = serializers.IntegerField(source="false_reports.count", read_only=True)

    class Meta:
        model = Alert
        fields = [
            "id",
            "title",
            "description",
            "location",
            "latitude",
            "longitude",
            "subtitle",
            "priority",
            "status",
            "notify_authorities",
            "created_at",
            "views",
            "reports",
            "comments",
            "author",
            "author_name",
            "author_id",
            "confirmations_count",
            "false_reports_count",
            "handled_by",
            "handled_by_id",
        ]
        # ... mantém o resto igual
        read_only_fields = [
            "author",
            "author_name",
            "author_id",
            "created_at",
            "views",
            "reports",
        ]

    def get_author_name(self, obj):
        if obj.author:
            # 1. Tenta ir buscar o nome real (first_name e last_name padrão do Django User)
            first_name = getattr(obj.author, 'first_name', '')
            last_name = getattr(obj.author, 'last_name', '')
            full_name = f"{first_name} {last_name}".strip()

            # 2. Retorna o nome completo se existir. 
            # 3. Se estiver vazio, tenta o username. 
            # 4. Se falhar tudo, retorna "Utilizador"
            return full_name or getattr(obj.author, 'username', '') or "Utilizador"
        
        return "Utilizador"

    def get_subtitle(self, obj):
        tempo = timesince(obj.created_at, now()).split(",")[0]
        return f"{obj.location} • há {tempo}"

    # NOVO MÉTODO: Retorna o nome da esquadra de forma limpa
    def get_handled_by_name(self, obj):
        if obj.handled_by:
            return obj.handled_by.station_name or "Autoridade Competente"
        return None