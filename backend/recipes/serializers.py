# Serializer converts Django model instances to Python data types for rendering in JSON or other content types
from rest_framework import serializers
from .models import Recipe
from users.serializers import UserSerializer

class RecipeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Recipe
        fields = [
            "recipe_id", "title", "content", "created_at", "total_time", "images",
            "ingredients", "ingredient_quantities", "rating", "review_count", "servings",
            "instructions", "author"
        ]