from django.db import models
from django.utils import timezone
from datetime import timedelta
from user.models import UserModel  # your existing user model

class Status(models.Model):
    STATUS_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
    ]

    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="statuses")
    media_type = models.CharField(max_length=10, choices=STATUS_TYPE_CHOICES)
    media_file = models.FileField(upload_to='status_media/')
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(hours=24)

    def __str__(self):
        return f"{self.user.username} - {self.media_type}"

    class Meta:
        ordering = ['-created_at']
