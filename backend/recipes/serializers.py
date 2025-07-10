from rest_framework import serializers
from .models import Recipe, Tag, Equipment
from users.serializers import UserProfileSerializer # Assuming this path is correct

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug'] # Slug is auto-generated

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug'] # Slug is auto-generated

class RecipeSerializer(serializers.ModelSerializer):
    # Use UserProfileSerializer for author detail (read-only)
    author = UserProfileSerializer(read_only=True)

    # Use TagSerializer for displaying tag details (read-only)
    tags = TagSerializer(many=True, read_only=True)

    # Use PrimaryKeyRelatedField for receiving tag IDs (write-only)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source='tags', required=False
    )

    # Equipment serialization (remains same)
    equipment = EquipmentSerializer(many=True, read_only=True)
    equipment_ids = serializers.PrimaryKeyRelatedField(
        queryset=Equipment.objects.all(), many=True, write_only=True, source='equipment', required=False
    )

    class Meta:
        model = Recipe
        fields = [
            'id', 'author', 'title', 'slug', 'description', 'main_image',
            'ingredients', 'instructions', 'prep_time_minutes',
            'cook_time_minutes', 'servings', 'difficulty',
            'tags', 'tag_ids', # Now only 'tags' and 'tag_ids'
            'equipment', 'equipment_ids',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'author', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Extract M2M fields with their write_only names
        tag_ids_data = validated_data.pop('tags', []) # 'tags' here corresponds to source='tags' for tag_ids
        equipment_ids_data = validated_data.pop('equipment', [])

        # Create the recipe instance
        recipe = Recipe.objects.create(**validated_data)

        # Set Many-to-Many relationships
        recipe.tags.set(tag_ids_data)
        recipe.equipment.set(equipment_ids_data)

        return recipe

    def update(self, instance, validated_data):
        # Extract M2M fields with their write_only names if present
        tag_ids_data = validated_data.pop('tags', None)
        equipment_ids_data = validated_data.pop('equipment', None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update Many-to-Many relationships if provided in the payload
        if tag_ids_data is not None:
            instance.tags.set(tag_ids_data)
        if equipment_ids_data is not None:
            instance.equipment.set(equipment_ids_data)

        instance.save()
        return instance

