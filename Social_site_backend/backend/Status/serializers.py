from rest_framework import serializers
from .models import Status

class StatusSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Status
        fields = ['id', 'user', 'user_name', 'media_type', 'media_file', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'user_name']
