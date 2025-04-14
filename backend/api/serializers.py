'''
Serializers convert Django model instances to Python data types for rendering in JSON or other content types

Serializers are used as below to send data in a way that the React frontend can read and use
'''
from rest_framework import serializers
from recipes.models import Recipe
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name', 'bio', 'profile_pic']
        extra_kwargs = {"password": {"write_only": True}}

        def create(self, validated_data):
            password = validated_data.pop('password', None)
            user = User(**validated_data)
            if password:
                user.set_password(password)
            user.save()
            return user
        
class RecipeSerializer(serializers.ModelSerializer):
    '''
    Converts Recipe model instances to JSON
    Handles relationship b/w recipes & users
    '''
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Recipe
        fields = ["recipe_id", "title", "content", "created_at", "total_time", "images", "ingredients", "ingredient_quantities", "rating", "review_count", "servings", "instructions", "author"]
