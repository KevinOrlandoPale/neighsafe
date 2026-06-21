from django.db import models
from django.conf import settings


class Alert(models.Model):

    # Adiciona estes dois campos dentro da classe Alert:
    confirmations = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="confirmed_alerts",
        blank=True
    )

    false_reports = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="false_reported_alerts",
        blank=True
    )

    # NOVO CAMPO: Quem assumiu o alerta?
    handled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_alerts",
        help_text="A esquadra/autoridade que assumiu a ocorrência."
    )

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    PRIORITIES = [
        ("low", "Baixa"),
        ("medium", "Média"),
        ("high", "Alta"),
    ]

    STATUS_CHOICES = [
        ('active', 'Ativo'),
        ('in_resolution', 'Em resolução'),
        ('resolved', 'Resolvido'),
        ('false', 'Falso'),
        ('pending_review', 'Pendente de Revisão'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )

    title = models.CharField(max_length=100)

    description = models.TextField()

    location = models.CharField(max_length=50)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    views = models.PositiveIntegerField(
        default=0
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITIES,
        default="medium"
    )

    notify_authorities = models.BooleanField(
        default=False
    )

    reports = models.PositiveIntegerField(
        default=0
    )

    is_fake = models.BooleanField(
        default=False
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="alerts"
    )

    def __str__(self):
        return self.title


class Comment(models.Model):

    alert = models.ForeignKey(
        Alert,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

class AuthorityNotification(models.Model):

    alert = models.ForeignKey(
        Alert,
        on_delete=models.CASCADE,
        related_name="authority_notifications"
    )

    authority_name = models.CharField(
        max_length=150
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.authority_name} → "
            f"{self.alert.title}"
        )