from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creating a new CustomUser instance.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        """
        Validates that the two password fields match.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields don't match."})
        return data

    def create(self, validated_data):
        """
        Creates and returns a new `CustomUser` instance, given validated data
        """
        validated_data.pop('password2') # Remove password2 (it's not a model field)
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Handles authentication using email and password.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)
            if not user:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating user profiles
    """
    class Meta:
        model = CustomUser
        fields = (
            'id', 'email', 'first_name', 'last_name', 'profile_picture',
            'bio', 'is_public', 'recipe_count', 'date_joined'
        )
        read_only_fields = ('id', 'email', 'recipe_count', 'date_joined') # These fields cannot be updated directly via profile

    def update(self, instance, validated_data):
        """
        Updates and returns an existing `CustomUser` instance, given the validated data.
        Handles profile picture updates.
        """
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.is_public = validated_data.get('is_public', instance.is_public)

        # Handle profile picture update
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
        elif validated_data.get('profile_picture') is None: # Allow clearing profile picture
            instance.profile_picture = None

        instance.save()
        return instance
