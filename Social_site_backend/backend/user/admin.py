from django.contrib import admin
from .models import UserModel
from django.utils.html import format_html
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('id' , 'username', 'name', 'email', 'avatar_preview','is_active','friend_list')
    search_fields = ('username', 'email')
    list_filter = ('is_active',)
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;" />', obj.avatar.url)
        return "-"
    avatar_preview.short_description = 'Avatar'

    def friend_list(self, obj):
        return ", ".join([friend.username for friend in obj.friends.all()])
    friend_list.short_description = 'Friends'

    def has_module_permission(self, request):
        return True  # ✅ This is correct
    def has_change_permission(self, request, obj=None):
        return True  # ✅ This is correct   
admin.site.register(UserModel, UserAdmin)

    