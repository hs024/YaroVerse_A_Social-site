from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.shortcuts import get_object_or_404
from posts.models import Post, Media ,Comment
from .serializers import PostSerializer, PostCreateUpdateSerializer ,CommentSerializer
from user.models import  UserModel

@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_post(request):
    serializer = PostCreateUpdateSerializer(data=request.data)
    if serializer.is_valid():
        post = serializer.save()
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@parser_classes([MultiPartParser, FormParser])
def update_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    serializer = PostCreateUpdateSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        post = serializer.save()

        # Remove selected media if passed
        remove_ids = request.data.getlist('remove_media')
        if remove_ids:
            Media.objects.filter(id__in=remove_ids, post=post).delete()

        return Response(PostSerializer(post).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.delete()
    return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)





# 1. Add comment to a post
@api_view(['POST'])
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    user_id = request.data.get("user")  # expects user ID from frontend
    text = request.data.get("text")

    if not user_id or not text:
        return Response({"error": "user and text are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(UserModel, id=user_id)

    comment = Comment.objects.create(post=post, user=user, text=text)
    return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


# 2. Delete a comment from a post
@api_view(['DELETE'])
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    comment.delete()
    return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)


# 3. Like / Unlike a post
@api_view(['POST'])
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user_id = request.data.get("user")  # expects user ID from frontend

    if not user_id:
        return Response({"error": "user is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(UserModel, id=user_id)

    if user in post.likes.all():
        post.likes.remove(user)
        post.likes_count = max(0, post.likes_count - 1)
        post.save()
        return Response({"message": "Like removed", "likes_count": post.likes_count})
    else:
        post.likes.add(user)
        post.likes_count += 1
        post.save()
        return Response({"message": "Post liked", "likes_count": post.likes_count})