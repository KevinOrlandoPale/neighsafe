from rest_framework import viewsets, status
from django.db.models import Q, Count
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Alert,
    Comment,
    AuthorityNotification
)

from .serializers import (
    AlertSerializer,
    CommentSerializer
)


class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer

    queryset = (
        Alert.objects
        .select_related("author")
        .prefetch_related(
            "comments",
            "comments__author"
        )
        .order_by("-created_at")
    )

    def perform_create(self, serializer):
        priority = serializer.validated_data.get("priority", "medium")
        notify = priority == "high"

        # Corrigido para "active" para que o Dashboard consiga contabilizar os novos alertas
        initial_status = "active"

        alert = serializer.save(
            author=self.request.user,
            notify_authorities=notify,
            status=initial_status
        )

        # Simulação do encaminhamento para as autoridades locais
        if notify:
            AuthorityNotification.objects.create(
                alert=alert,
                authority_name="Polícia da República de Moçambique"
            )

    @action(detail=True, methods=["get"])
    def authority_status(self, request, pk=None):
        alert = self.get_object()
        return Response({
            "priority": alert.priority,
            "notify_authorities": alert.notify_authorities,
            "status": alert.status
        })

    @action(detail=True, methods=["post"], url_path="comment")
    def comment(self, request, pk=None):
        """
        Rota personalizada para receber POST em /api/alerts/<id>/comment/
        """
        alert = self.get_object()
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(author=request.user, alert=alert)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="confirm")
    def confirm(self, request, pk=None):
        alert = self.get_object()
        
        if alert.confirmations.filter(id=request.user.id).exists():
            alert.confirmations.remove(request.user)
        else:
            alert.confirmations.add(request.user)
            alert.false_reports.remove(request.user)
        
        if alert.confirmations.count() >= 5:
            alert.priority = "high"
            
        alert.save()
        return Response({
            "confirmations_count": alert.confirmations.count(),
            "false_reports_count": alert.false_reports.count(),
            "priority": alert.priority
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="false-report")
    def false_report(self, request, pk=None):
        alert = self.get_object()
        
        if alert.false_reports.filter(id=request.user.id).exists():
            alert.false_reports.remove(request.user)
        else:
            alert.false_reports.add(request.user)
            alert.confirmations.remove(request.user)
            
        if alert.false_reports.count() >= 5:
            alert.status = "pending_review"
            
        alert.save()
        return Response({
            "confirmations_count": alert.confirmations.count(),
            "false_reports_count": alert.false_reports.count(),
            "status": alert.status
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="resolve")
    def resolve_alert(self, request, pk=None):
        alert = self.get_object()
        
        if alert.author != request.user:
            return Response({"error": "Não tens permissão para resolver este alerta."}, status=status.HTTP_403_FORBIDDEN)
            
        alert.status = "resolved"
        alert.save()
        return Response({"status": alert.status}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="update-status")
    def update_status(self, request, pk=None):
        alert = self.get_object()
        new_status = request.data.get("status")
        
        valid_statuses = [choice[0] for choice in Alert.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({"error": f"Estado inválido. Escolha entre: {valid_statuses}"}, status=status.HTTP_400_BAD_REQUEST)
        
        alert.status = new_status
        alert.save()
        return Response({"status": alert.status}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        try:
            counts = Alert.objects.aggregate(
                active=Count('id', filter=Q(status='active')),
                in_resolution=Count('id', filter=Q(status='in_resolution')),
                resolved=Count('id', filter=Q(status='resolved')),
                critical=Count('id', filter=Q(status='active', priority='high'))
            )
            return Response(counts, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["post"], url_path="assume")
    def assume_alert(self, request, pk=None):
        """ Rota exclusiva para as autoridades assumirem um alerta """
        alert = self.get_object()

        # 1. Verifica se quem está a clicar é mesmo uma autoridade
        if not getattr(request.user, 'is_authority', False):
            return Response(
                {"error": "Acesso negado. Apenas autoridades podem assumir ocorrências."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # 2. Verifica se outra esquadra já não assumiu isto antes
        if alert.handled_by:
            return Response(
                {"error": "Este alerta já foi assumido por outra esquadra."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. A Esquadra assume e o estado muda automaticamente
        alert.handled_by = request.user
        alert.status = "in_resolution"
        alert.save()

        # BÓNUS DE UX: O sistema deixa um comentário oficial automático para acalmar os vizinhos
        station_name = request.user.station_name or "As autoridades"
        Comment.objects.create(
            alert=alert,
            author=request.user,
            text=f"🚨 STATUS OFICIAL: A {station_name} assumiu esta ocorrência e uma equipa foi despachada."
        )

        return Response({
            "status": alert.status,
            "handled_by": station_name
        }, status=status.HTTP_200_OK)


    @action(detail=True, methods=["post"], url_path="resolve")
    def resolve_alert(self, request, pk=None):
        """ Lógica blindada de resolução """
        alert = self.get_object()
        
        # CENA 1: A polícia já assumiu o caso. 
        if alert.handled_by:
            # Se for um civil a tentar resolver, bloqueamos!
            if not getattr(request.user, 'is_authority', False):
                return Response(
                    {"error": "Esta ocorrência está sob jurisdição policial e não pode ser encerrada por civis."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            # Se for uma autoridade, só a esquadra que assumiu pode resolver.
            if alert.handled_by != request.user:
                return Response(
                    {"error": "Apenas a esquadra que assumiu pode dar o caso como resolvido."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # CENA 2: A polícia NÃO assumiu o caso (ex: alerta menor resolvido pelos vizinhos)
        else:
            # Apenas o autor original pode resolver
            if alert.author != request.user:
                return Response(
                    {"error": "Não tens permissão para resolver este alerta."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
        alert.status = "resolved"
        alert.save()
        return Response({"status": alert.status}, status=status.HTTP_200_OK)

    # Adiciona isto no teu AlertViewSet
    @action(detail=False, methods=["get"], url_path="map-data")
    def map_data(self, request):
        alerts = Alert.objects.exclude(latitude__isnull=True).exclude(longitude__isnull=True)
        # Serializa apenas os campos necessários para o mapa (performance)
        data = [{"id": a.id, "title": a.title, "lat": a.latitude, "lng": a.longitude, "status": a.status, "priority": a.priority} for a in alerts]
        return Response(data)

    @action(detail=False, methods=["get"], url_path="map-data")
    def map_data(self, request):
        # Filtra apenas críticos que não estejam resolvidos
        alerts = Alert.objects.filter(
            priority='high', 
            status__in=['active', 'in_resolution']
        ).exclude(latitude__isnull=True)
        
        data = [{
            "id": a.id, 
            "title": a.title, 
            "lat": a.latitude, 
            "lng": a.longitude, 
            "status": a.status,
            "priority": a.priority
        } for a in alerts]
        return Response(data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = (
        Comment.objects
        .select_related("author")
        .order_by("-created_at")
    )
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)