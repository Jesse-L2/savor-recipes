import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver

class Tag(models.Model):
    """
    Represents a tag that can be applied to recipes.
    This now encompasses what were previously 'categories' and 'tags'.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    # --- REVERTED TO ORIGINAL (DESIRED) STATE ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # --- END REVERTED ---

    class Meta:
        ordering = ['name']
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def __str__(self):
        return self.name

@receiver(pre_save, sender=Tag)
def pre_save_tag_slug(sender, instance, **kwargs):
    """
    Automatically generates a slug for the Tag model if it doesn't exist.
    Ensures slug is unique.
    """
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while Tag.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug

class Recipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    main_image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)
    ingredients = models.JSONField(default=list) # [{'item': 'flour', 'quantity': '2 cups'}]
    instructions = models.JSONField(default=list) # ['step 1', 'step 2']
    prep_time_minutes = models.PositiveIntegerField(blank=True, null=True)
    cook_time_minutes = models.PositiveIntegerField(blank=True, null=True)
    servings = models.PositiveIntegerField(blank=True, null=True)
    difficulty_choices = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    difficulty = models.CharField(max_length=10, choices=difficulty_choices, default='Medium')

    # Many-to-many relationship with the unified Tag model
    tags = models.ManyToManyField(Tag, related_name='recipes', blank=True)

    # Equipment model remains the same
    equipment = models.ManyToManyField('Equipment', related_name='recipes', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

@receiver(pre_save, sender=Recipe)
def pre_save_recipe_slug(sender, instance, **kwargs):
    """
    Automatically generates a slug for the Recipe model if it doesn't exist or title changes.
    Ensures slug is unique.
    """
    if not instance.slug or (instance.pk and sender.objects.get(pk=instance.pk).title != instance.title):
        base_slug = slugify(instance.title)
        slug = base_slug
        counter = 1
        while Recipe.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug


class Equipment(models.Model):
    """
    Represents a piece of equipment used in recipes.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    # --- REVERTED TO ORIGINAL (DESIRED) STATE ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # --- END REVERTED ---

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Equipment"

    def __str__(self):
        return self.name

@receiver(pre_save, sender=Equipment)
def pre_save_equipment_slug(sender, instance, **kwargs):
    """
    Automatically generates a slug for the Equipment model if it doesn't exist.
    Ensures slug is unique.
    """
    if not instance.slug:
        base_slug = slugify(instance.name)
        slug = base_slug
        counter = 1
        while Equipment.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        instance.slug = slug