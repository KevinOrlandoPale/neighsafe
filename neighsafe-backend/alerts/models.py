from django.db import models
from django.conf import settings

class Alert(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField()
    location=models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)

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
     related_name='comments'
     )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
