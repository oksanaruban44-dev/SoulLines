from django.contrib import admin
from .models import Poem, Subscriber, Notification, PoeticMessage, Comment


@admin.register(Poem)
class PoemAdmin(admin.ModelAdmin):
    list_display = ("title", "slug")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("author", "poem", "created_at")
    search_fields = ("text", "author__username", "poem__title")
    list_filter = ("created_at",)


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "text", "is_read", "created_at")


@admin.register(PoeticMessage)
class PoeticMessageAdmin(admin.ModelAdmin):
    list_display = ("poem",)


