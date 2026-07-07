from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('poem/<int:id>/', views.poem_detail, name='poem_detail'),
    path('cards/', views.cards_index, name='cards_index'),
    path('cards/<int:id>/', views.poem_cards, name='poem_cards'),

    path('notifications/', views.notifications_view, name='notifications'),

    path('register/', views.register_view, name='register'),

    path('login/', auth_views.LoginView.as_view(
        template_name='registration/login.html'
    ), name='login'),

    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('cabinet/', views.cabinet, name='cabinet'),
]