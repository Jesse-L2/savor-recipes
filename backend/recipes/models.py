from django.db import models
from django.conf import settings
# Create your models here.

class Recipe(models.Model):
    
    recipe_id = models.BigIntegerField(unique=True)
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

    def __str__(self):
        return f"Recipe({self.recipe_id}): {self.title}"