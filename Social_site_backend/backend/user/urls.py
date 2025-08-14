from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('user/<int:user_id>/', views.get_user_detail),
    path('user/<int:user_id>/friends/', views.get_user_friends),
    path('user/update/', views.update_current_user),
    path('user/<int:friend_id>/toggle-friend/', views.toggle_friend, name='toggle-friend'),
        path('user/', views.get_all_users, name='get_all_users'),

]
