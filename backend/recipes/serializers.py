# Serializer converts Django model instances to Python data types for rendering in JSON or other content types
from rest_framework import serializers
from .models import Recipe
from django.contrib.auth.models import User

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ["recipe_id", "title", "content", "created_at", "total_time", "images", "ingredients", "ingredient_quantities", "rating", "review_count", "servings", "instructions"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

        def create(self, validated_data):
            print(validated_data)
            user = User.objects.create_user(**validated_data)
            return user
