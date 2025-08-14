from django import forms
from .models import Post, Media

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']

class MediaForm(forms.ModelForm):
    class Meta:
        model = Media
        fields = ['type', 'file']
