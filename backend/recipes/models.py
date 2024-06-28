from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Author(models.Model):
    author_name = models.CharField(max_length=100)
    author_id = models.ForeignKey(on_delete=models.CASCADE, related_name="recipes")

    def __str__(self):
        return self.author_name


class Recipe(models.Model):
    recipe_id = models.BigIntegerField(unique=True)
    title = models.CharField(max_length=150)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    total_time = models.CharField(max_length=50)
    images = models.TextField()
    ingredients = models.TextField()
    ingredient_quantities = models.TextField()
    rating = models.FloatField()
    review_count = models.IntegerField()
    servings = models.BigIntegerField()
    instructions = models.TextField()


    def __str__(self):
        return self.title