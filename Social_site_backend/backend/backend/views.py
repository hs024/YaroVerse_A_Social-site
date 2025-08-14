from django.shortcuts import render, get_object_or_404, redirect
from django.shortcuts import render
from user.models import UserModel

def home(request):
    query = request.GET.get('q', '')  # Get search text from input
    if query:
        users = UserModel.objects.filter(username__icontains=query)
    else:
        users = UserModel.objects.all()
    
    return render(request, 'home.html', {'users': users})


def change(request, user_id):
    user = get_object_or_404(UserModel, id=user_id)
    all_users = UserModel.objects.exclude(id=user_id)  # For friends list

    if request.method == "POST":
        user.username = request.POST.get("username")
        user.email = request.POST.get("email")
        user.bio = request.POST.get("bio")
        user.name = request.POST.get("name", "").strip()

        
        # Avatar handling
        if "remove_avatar" in request.POST:
            user.avatar.delete(save=False)
            user.avatar = None
        elif "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]

        # Password update
        password = request.POST.get("password", "").strip()
        if password:
            user.password = password  # save() will hash it

        user.save()

        # Update friends
        friends_ids = request.POST.getlist("friends")
        user.friends.set(UserModel.objects.filter(id__in=friends_ids))
        user.save()
        return redirect("home")

    return render(request, "change.html", {"user": user, "all_users": all_users})


def delete_user(request, user_id):
    user = get_object_or_404(UserModel, id=user_id)
    if request.method == "POST":
        user.delete()
        return redirect("home")
    return redirect("change", user_id=user_id)


def create_user(request):
    all_users = UserModel.objects.all()  # for friends selection

    if request.method == "POST":
        username = request.POST.get("username")
        name = request.POST.get("name")
        email = request.POST.get("email")
        bio = request.POST.get("bio")
        password = request.POST.get("password")
        avatar = request.FILES.get("avatar")

        user = UserModel(username=username, email=email, bio=bio, password=password,name=name)
        if avatar:
            user.avatar = avatar
        user.save()

        # Save friends
        friends_ids = request.POST.getlist("friends")
        user.friends.set(UserModel.objects.filter(id__in=friends_ids))

        return redirect("home")

    return render(request, "create.html", {"all_users": all_users})
