"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from .views import home,change,delete_user,create_user

urlpatterns = [
    path('', home, name='home'),
    path('change/<int:user_id>/', change, name='change'),
    path('delete/<int:user_id>/', delete_user, name='delete_user'),
    path('create/', create_user, name='create_user'),
    path('posts/', include('posts.urls')),
    # path('admin/', admin.site.urls),

    path('api/', include('user.urls')),
    path('api/posts/', include('postapi.urls')),
    path('api/status/', include('Status.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)