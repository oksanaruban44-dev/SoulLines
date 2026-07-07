from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Poem(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    text = models.TextField(null=True, blank=True)
    author_thought = models.TextField(blank=True, null=True)
    css_theme = models.CharField(max_length=50, default="default")

    audio_file = models.CharField(
        max_length=50,
        default='audio.wav'
    )
    def __str__(self):
        return self.title


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text

class PoeticMessage(models.Model):
    poem = models.ForeignKey(
        Poem,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    image = models.ImageField(upload_to='messages/')

    def __str__(self):
        return f"Карточка для {self.poem.title}"


class Comment(models.Model):
    poem = models.ForeignKey(
        Poem,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    text = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author.username}: {self.poem.title}"