# posts/models.py
from django.db import models
from django.utils import timezone
from django.utils.html import mark_safe
from user.models import UserModel   # <- adjust if your user app/model name differs

class Post(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # store a numeric likes count (useful to import your JSON which contains counts)
    likes_count = models.PositiveIntegerField(default=0)

    # optional: record exactly which users liked (useful if you want accurate like/unlike)
    likes = models.ManyToManyField(UserModel, blank=True, related_name='liked_posts')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username}: {self.content[:40]}'

    def media_count(self):
        return self.media.count()
    media_count.short_description = 'Media'

    def comments_count(self):
        return self.comments.count()
    comments_count.short_description = 'Comments'


class Media(models.Model):
    IMAGE = 'image'
    VIDEO = 'video'
    Audio = 'audio'
    MEDIA_TYPES = [
        (IMAGE, 'Image'),
        (VIDEO, 'Video'),
        (Audio, 'audio'),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='media')
    type = models.CharField(max_length=10, choices=MEDIA_TYPES)
    # either a file upload (preferred) or a url/relative path (both supported)
    file = models.FileField(upload_to='post_media/', blank=True, null=True)
    url = models.CharField(max_length=600, blank=True)   # store /assets/... or external url
    order = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f'{self.type} for post {self.post_id}'

    def media_url(self):
        if self.file:
            return self.file.url
        return self.url

    def preview_html(self):
        url = self.media_url()
        if not url:
            return ""
        if self.type == Media.IMAGE:
            return mark_safe(f'<img src="{url}" style="max-height:150px; max-width:250px;" />')
        if self.type == Media.VIDEO:
            return mark_safe(f'<video src="{url}" controls style="max-height:150px; max-width:250px;"></video>')
        if self.type == Media.Audio:
            return mark_safe(f'<audio src="{url}" controls "></audio>')
        return ""


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True, blank=True, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Comment {self.id} on Post {self.post_id}'
    