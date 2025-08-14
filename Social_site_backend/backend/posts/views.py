from django.shortcuts import render, redirect, get_object_or_404
from .models import Post, Media
from user.models import UserModel as User
from .forms import PostForm
from django.contrib import messages


def create_post(request):
    if request.method == 'POST':
        post_form = PostForm(request.POST)
        files = request.FILES.getlist('media_files')

        if post_form.is_valid():
            post = post_form.save(commit=False)
            selected_user_id = request.POST.get("user")
            post.user = get_object_or_404(User, id=selected_user_id)
            post.save()

            for file in files:
                media_type = "video" if file.content_type.startswith("video") else "image"
                Media.objects.create(post=post, type=media_type, file=file)

            messages.success(request, "Post created successfully!")
            return redirect('list_posts')
    else:
        post_form = PostForm()

    users = User.objects.all()
    return render(request, 'post/create_post.html', {
        'post_form': post_form,
        'users': users
    })


def list_posts(request):
    users = User.objects.all()
    username_query = request.GET.get("username", "").strip()

    posts = Post.objects.all().order_by('-created_at')

    # Filter by username if search query exists
    if username_query:
        posts = posts.filter(user__username__icontains=username_query)

    # Handle like action
    # print("like post")
    if request.method == "POST" and "like_post" in request.POST:
        post_id = request.POST.get("post_id")
        user_id = request.POST.get("user")
        post = get_object_or_404(Post, id=post_id)
        user = get_object_or_404(User, id=user_id)
        if post.likes.filter(id=user.id).exists():
            post.likes.remove(user)
            post.likes_count = max(0, post.likes_count - 1)
            messages.success(request, f"{user.username} unliked the post.")
        else:
            post.likes.add(user)
            post.likes_count += 1
            # print("liked")
        post.save()
        messages.success(request, f"{user.username} liked the post.")
        return redirect('list_posts')

    # Handle comment action
    if request.method == "POST" and "comment_post" in request.POST:
        post_id = request.POST.get("post_id")
        user_id = request.POST.get("user")
        content = request.POST.get("comment_content")
        post = get_object_or_404(Post, id=post_id)
        user = get_object_or_404(User, id=user_id)
        post.comments.create(user=user, text=content)
        messages.success(request, f"{user.username} commented on the post.")
        return redirect('list_posts')
    return render(request, 'post/list_posts.html', {
        'posts': posts,
        'users': users,
        'username_query': username_query
    })

def delete_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    if request.method == 'POST':
        post.delete()
        messages.success(request, "Post deleted successfully.")
        return redirect('list_posts')
    return render(request, 'post/confirm_delete.html', {'post': post})






#  !     update post
def update_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    users = User.objects.all()

    if request.method == 'POST':
        post_form = PostForm(request.POST, instance=post)
        files = request.FILES.getlist('media_files')

        if post_form.is_valid():
            post = post_form.save(commit=False)
            post.user = get_object_or_404(User, id=request.POST.get('user'))
            post.save()

            # Remove selected media
            remove_ids = request.POST.getlist('remove_media')
            if remove_ids:
                Media.objects.filter(id__in=remove_ids, post=post).delete()

            # Add new media
            for file in files:
                media_type = "video" if file.content_type.startswith("video") else "image"
                Media.objects.create(post=post, type=media_type, file=file)

            messages.success(request, "Post updated successfully!")
            return redirect('list_posts')

    else:
        post_form = PostForm(instance=post)

    return render(request, 'post/update_post.html', {
        'post': post,
        'users': users,
        'post_form': post_form
    })
