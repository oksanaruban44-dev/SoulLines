from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse

from .models import Poem, Notification, Comment
from .forms import CommentForm, RegisterForm

def index(request):
    poems = Poem.objects.all()
    return render(request, 'poetry/index.html', {'poems': poems})


def poem_detail(request, id):
    poem = get_object_or_404(Poem, id=id)

    comments = poem.comments.all()

    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("login")

        form = CommentForm(request.POST)

        if form.is_valid():
            comment = form.save(commit=False)
            comment.poem = poem
            comment.author = request.user
            comment.save()

            return redirect("poem_detail", id=poem.id)
    else:
        form = CommentForm()

    return render(request, "poetry/poem_detail.html", {
        "poem": poem,
        "comments": comments,
        "form": form
    })


def cards_index(request):
    poems = Poem.objects.all()
    return render(request, 'poetry/cards_index.html', {'poems': poems})

def poem_cards(request, id):
    poem = get_object_or_404(Poem, id=id)
    return render(request, 'poetry/poem_cards.html', {'poem': poem})



def notifications_view(request):
    return HttpResponse("Notifications coming soon 🔔")

def base_context(request):
    if request.user.is_authenticated:
        unread_count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
    else:
        unread_count = 0

    return {"unread_count": unread_count}


def register_view(request):
    form = RegisterForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        return redirect('index')

    return render(request, 'poetry/register.html', {'form': form})



def login_view(request):
    error = None

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            error = "Неверный логин или пароль"

    return render(request, "registration/login.html", {"error": error})

@login_required
def cabinet(request):
    return render(request, "poetry/cabinet.html")