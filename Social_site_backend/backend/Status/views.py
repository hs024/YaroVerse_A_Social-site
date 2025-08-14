from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Status
from .serializers import StatusSerializer
from user.models import UserModel

@api_view(['POST'])
def create_status(request):
    serializer = StatusSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def list_status(request):
    valid_time = timezone.now() - timedelta(hours=24)

    # Delete old statuses
    Status.objects.filter(created_at__lt=valid_time).delete()

    # Get all recent statuses (last 24 hrs)
    statuses = Status.objects.filter(
        created_at__gte=valid_time
    ).order_by('-created_at')

    serializer = StatusSerializer(statuses, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_status(request, pk):
    try:
        status_obj = Status.objects.get(pk=pk)
    except Status.DoesNotExist:
        return Response({"error": "Status not found"}, status=status.HTTP_404_NOT_FOUND)

    if status_obj.user != request.user:
        return Response({"error": "You can only delete your own status."}, status=status.HTTP_403_FORBIDDEN)

    status_obj.delete()
    return Response({"message": "Status deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# !   for admin
# views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import Status

def status_admin_view(request):
    valid_time = timezone.now() - timedelta(hours=24)
    Status.objects.filter(created_at__lt=valid_time).delete()

    statuses = Status.objects.filter(created_at__gte=valid_time).order_by('-created_at')

    if request.method == "POST":
        status_id = request.POST.get("delete_status_id")
        if status_id:
            status_obj = get_object_or_404(Status, pk=status_id)
            status_obj.delete()
            return redirect('status-admin')

    return render(request, 'status/status_admin.html', {'statuses': statuses})
