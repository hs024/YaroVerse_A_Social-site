from django.urls import path
from .views import create_status, list_status, delete_status,status_admin_view

urlpatterns = [
    path('status/create/', create_status, name='create-status'),
    path('status/', list_status, name='list-status'),
    path('status/<int:pk>/delete/', delete_status, name='delete-status'),

    path('status/admin/', status_admin_view, name='status-admin'),
]
