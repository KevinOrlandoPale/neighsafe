from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Alert
from .serializers import AlertSerializer
from .permissions import IsOwnerOrAdmin
from rest_framework.exceptions import PermissionDenied

class AlertViewSet(ModelViewSet):
    queryset = Alert.objects.all().order_by("-created_at")
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    serializer_class = AlertSerializer

    @action(detail=True, methods=["post"])
    def comment(self, request, pk=None):
        alert = self.get_object()

        text = request.data.get("text")

        if not text:
            return Response({"error": "Texto vazio"}, status=400)

        comment = Comment.objects.create(
            alert=alert,
            author=request.user,
            text=text
        )

        return Response({
            "id": comment.id,
            "text": comment.text,
            "author_name": comment.author.email
        }, status=201)

    def get_permisions(self):
        if self.action in ["destroy", "update"]:
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AlertDetailView(generics.RetrieveAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
    alert = self.get_object()

    if alert.author != request.user:
        raise PermissionDenied("Não tens permissão")

    return super().destroy(request, *args, **kwargs)
