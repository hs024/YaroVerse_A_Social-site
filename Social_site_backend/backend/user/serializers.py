from rest_framework import serializers
from .models import UserModel

class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'username', 'name', 'email', 'avatar', 'bio', 'created_at', 'updated_at', 'is_active', 'friends']
        read_only_fields = ['id', 'created_at', 'updated_at']
