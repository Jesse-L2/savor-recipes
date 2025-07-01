# Serializer converts Django model instances to Python data types for rendering in JSON or other content types
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Recipe, Category, Tag, Equipment
from users.serializers import PublicUserSerializer

User = get_user_model()

class RecipeSerializer(serializers.ModelSerializer):
    """
    Serializer for Recipe model. Handles nested author (read-only), author_id (write-only),
    makes recipe_id read-only, and images optional.
    """
    author = PublicUserSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='author', write_only=True)
    images = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Recipe
        fields = [
            "id", "title", "content", "created_at", "total_time", "images",
            "ingredients", "ingredient_quantities", "rating", "review_count", "servings",
            "instructions", "author", "author_id"
        ]
        read_only_fields = ["id"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name']