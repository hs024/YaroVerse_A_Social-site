from rest_framework import serializers
from posts.models import Post, Media, Comment

class MediaSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = ['id', 'type', 'media_url', 'order']

    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'text', 'created_at']

    

class PostSerializer(serializers.ModelSerializer):
    media = MediaSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    likes=serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'user_username', 'content', 'created_at', 'updated_at',
                  'likes_count', 'comments_count', 'media','comments','likes']
    def get_likes(self, obj):
        # Return a list of user IDs who liked the post
        return list(obj.likes.values_list('id', flat=True))
class PostCreateUpdateSerializer(serializers.ModelSerializer):
    media_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = ['user', 'content', 'media_files']

    def create(self, validated_data):
        media_files = validated_data.pop('media_files', [])
        post = Post.objects.create(**validated_data)

        for file in media_files:
            if file.content_type.startswith("image"):
                media_type = "image"
            elif file.content_type.startswith("video"):
                media_type = "video"
            elif file.content_type.startswith("audio"):
                media_type = "audio"
            else:
                media_type = "image"

            Media.objects.create(post=post, type=media_type, file=file)

        return post

    def update(self, instance, validated_data):
        media_files = validated_data.pop('media_files', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Add new media files
        for file in media_files:
            media_type = "video" if file.content_type.startswith("video") else "image"
            Media.objects.create(post=instance, type=media_type, file=file)

        return instance
