# posts/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Post, Media, Comment

class MediaInline(admin.TabularInline):
    model = Media
    extra = 0
    fields = ('type', 'file', 'url', 'order', 'media_preview')
    readonly_fields = ('media_preview',)

    def media_preview(self, obj):
        if not obj:
            return ""
        # use model helper to render
        return obj.preview_html()
    media_preview.short_description = 'Preview'


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ('user', 'text', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'short_content', 'likes_count', 'media_count', 'comments_count', 'created_at')
    search_fields = ('content', 'user__username')
    list_filter = ('created_at',)
    inlines = (MediaInline, CommentInline)
    readonly_fields = ('created_at', 'updated_at')

    def short_content(self, obj):
        return obj.content[:60]
    short_content.short_description = 'Content'


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'type', 'file_or_url', 'order')
    search_fields = ('post__content', )

    def file_or_url(self, obj):
        return obj.file.url if obj.file else obj.url
    file_or_url.short_description = 'File / URL'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'user', 'text', 'created_at')
    search_fields = ('text', 'user__username')
