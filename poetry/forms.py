from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Comment


# 🔹 РЕГИСТРАЦИЯ
class RegisterForm(UserCreationForm):
    username = forms.CharField(label="Логин")

    password1 = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput
    )

    password2 = forms.CharField(
        label="Повторите пароль",
        widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = ("username", "password1", "password2")

    help_texts = {
        "username": "",
    }


# 🔹 КОММЕНТАРИИ
class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
        labels = {
            "text": "Комментарий"
        }