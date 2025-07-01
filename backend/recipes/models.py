from django.db import models
from django.conf import settings
from uuid import uuid4
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Equipment(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    recipe_id = models.UUIDField(primary_key=True, default=uuid4, editable=False, unique=True)
    title = models.CharField(max_length=150)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_time = models.CharField(max_length=50)
    images = models.ImageField(upload_to='recipe_images/', blank=True)
    ingredients = models.TextField()
    ingredient_quantities = models.TextField()
    rating = models.FloatField()
    review_count = models.IntegerField()
    servings = models.BigIntegerField()
    instructions = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recipes")
    categories = models.ManyToManyField(Category, related_name="recipes", blank=True)
    tags = models.ManyToManyField(Tag, related_name="recipes", blank=True)
    prep_time = models.PositiveIntegerField(help_text="Preparation time in minutes", null=True, blank=True)
    cook_time = models.PositiveIntegerField(help_text="Cooking time in minutes", null=True, blank=True)
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, null=True, blank=True)
    required_equipment = models.ManyToManyField(Equipment, related_name="recipes", blank=True)

    def __str__(self):
        return f"Recipe({self.recipe_id}): {self.title}"