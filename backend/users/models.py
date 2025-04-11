from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Profile metrics
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True)
    recipes_count = models.PositiveIntegerField(default=0)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Settings
    public_profile = models.BooleanField(default=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username