# Django view is a Python function that takes http requests and returns an http response
from rest_framework import serializers
from .models import Recipe

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        user = UserSerializer