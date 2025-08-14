from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.get_posts, name='get_posts_api'),
    path('posts/create/', views.create_post, name='create_post_api'),
    path('posts/<int:pk>/update/', views.update_post, name='update_post_api'),
    path('posts/<int:pk>/delete/', views.delete_post, name='delete_post_api'),

     path('posts/<int:post_id>/comments/add/', views.add_comment),
    path('comments/<int:comment_id>/delete/', views.delete_comment),
    path('posts/<int:post_id>/like-toggle/', views.toggle_like),
]
