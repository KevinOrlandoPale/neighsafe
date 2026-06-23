from rest_framework import viewsets, permissions
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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        queryset = (
            Alert.objects
            .select_related(
                "author",
                "handled_by"
            )
            .prefetch_related(
                "comments",
                "comments__author"
            )
            .order_by(
                "-created_at"
            )
        )

        priority = (
            self.request
            .query_params
            .get("priority")
        )

        if priority:

            queryset = queryset.filter(
                priority=priority
            )

        return queryset


    def perform_create(self, serializer):

        alert = serializer.save(
            author=self.request.user
        )

        if alert.priority == "high":

            alert.notify_authorities = True

            alert.status = (
                "pending_review"
            )

            alert.save()

            AuthorityNotification.objects.create(
                alert=alert,
                authority_name="PRM"
            )

    @action(
        detail=True,
        methods=["post"]
    )
    def comment(
        self,
        request,
        pk=None
    ):

        alert = self.get_object()

        text = request.data.get(
            "text"
        )

        if not text:

            return Response(
                {
                    "error":
                    "Comentário obrigatório"
                },
                status=400
            )

        comment = Comment.objects.create(
            alert=alert,
            author=request.user,
            text=text
        )

        serializer = (
            CommentSerializer(
                comment
            )
        )

        return Response(
            serializer.data,
            status=201
        )


    @action(
        detail=True,
        methods=["post"]
    )
    def assume(self, request, pk=None):

        alert = self.get_object()

        alert.status = (
            "in_resolution"
        )

        alert.handled_by = (
            request.user
        )

        alert.save()

        return Response({
            "message":
            "Alerta assumido"
        })

    @action(
        detail=False,
        methods=["get"]
    )
    def stats(self, request):

        return Response({

            "critical": Alert.objects.filter(
                priority="high"
            ).count(),

            "active": Alert.objects.filter(
                status="active"
            ).count(),

            "in_resolution": Alert.objects.filter(
                status="in_resolution"
            ).count(),

            "resolved": Alert.objects.filter(
                status="resolved"
            ).count(),

        })
        

class CommentViewSet(
    viewsets.ModelViewSet
):

    queryset = (
        Comment.objects
        .select_related(
            "author",
            "alert"
        )
        .order_by(
            "-created_at"
        )
    )

    serializer_class = (
        CommentSerializer
    )

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            author=self.request.user
        )