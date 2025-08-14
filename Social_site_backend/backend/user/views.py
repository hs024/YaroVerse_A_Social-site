from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.db.models import Q
from .models import UserModel
from .serializers import UserModelSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserModel
from .serializers import UserModelSerializer
from django.db import models
from rest_framework.authtoken.models import Token


# !     register
@api_view(['POST'])
def register_user(request):
    data = request.data
    required_fields = ['username', 'name', 'email', 'password']
    
    for field in required_fields:
        if field not in data:
            return Response({field: "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check for existing user
    if UserModel.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)
    if UserModel.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    user = UserModel.objects.create(
        username=data['username'],
        name=data['name'],
        email=data['email'],
        password=data['password'],  # Will be hashed in model save()
        bio=data.get('bio', ''),
        avatar=request.FILES.get('avatar')  # Optional
    )

    serializer = UserModelSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


#          !   Login
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

@api_view(['POST'])
def login_user(request):
    identifier = request.data.get('identifier')  # username or email
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'error': 'Identifier and password are required.'}, status=400)

    try:
        user = UserModel.objects.get(Q(email=identifier) | Q(username=identifier))
    except UserModel.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

    if not user.check_password(password):
        return Response({'error': 'Invalid credentials.'}, status=401)

    # Generate JWT token
    refresh = RefreshToken.for_user(user)

    serializer = UserModelSerializer(user)
    return Response({
        'user': serializer.data,
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }, status=200)

#  !       Get user details and friends
@api_view(['GET'])
def get_user_detail(request, user_id):
    try:
        user = UserModel.objects.get(id=user_id)
    except UserModel.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserModelSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
def get_user_friends(request, user_id):
    try:
        user = UserModel.objects.get(id=user_id)
    except UserModel.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    friends = user.friends.all()
    serializer = UserModelSerializer(friends, many=True)
    return Response(serializer.data)


# !        updation

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_current_user(request):
    user = request.user  # Comes from authentication token/session

    data = request.data

    # Update fields if provided
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.bio = data.get('bio', user.bio)
    user.is_active = data.get('is_active', user.is_active)

    # Update avatar if uploaded
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']

    # Update password if provided (will be hashed in model)
    if 'password' in data and data['password'].strip():
        user.password = data['password']  # Will be hashed in model.save()

    user.save()
    serializer = UserModelSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)



# ! toggle friend
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import UserModel
from .serializers import UserModelSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_friend(request, friend_id):
    try:
        # Get the friend user object
        friend = UserModel.objects.get(id=friend_id)
    except UserModel.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    current_user = request.user
    
    # Check if they're already friends
    if current_user.friends.filter(id=friend_id).exists():
        # Remove friend
        current_user.friends.remove(friend)
        friend.friends.remove(current_user)  # Remove from both sides since it's symmetrical
        action = 'removed'
    else:
        # Add friend
        current_user.friends.add(friend)
        action = 'added'
    
    # Save both users to ensure the relationship is updated
    current_user.save()
    friend.save()
    
    # Serialize the current user to return updated friend list
    serializer = UserModelSerializer(current_user)
    
    return Response({
        'status': f'Friend {action} successfully',
        'user': serializer.data,
        'is_friend': action == 'added'
    }, status=status.HTTP_200_OK)


# ! all user

@api_view(['GET'])
def get_all_users(request):
    users = UserModel.objects.all()
    serializer = UserModelSerializer(users, many=True)
    return Response(serializer.data)