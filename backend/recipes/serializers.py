from rest_framework import serializers
from .models import Recipe, Tag, Equipment
from users.serializers import UserProfileSerializer # Assuming this path is correct
from django.utils.text import slugify # Import slugify

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

    # Equipment serialization for displaying details (read-only)
    equipment = EquipmentSerializer(many=True, read_only=True)

    # NEW: Field to receive equipment names as a list of strings (write-only)
    # This field will be handled in create/update methods
    equipment_names = serializers.ListField(
        child=serializers.CharField(max_length=255),
        write_only=True,
        required=False,
        allow_empty=True
    )

    class Meta:
        model = Recipe
        fields = [
            'id', 'author', 'title', 'slug', 'description', 'main_image',
            'ingredients', 'instructions', 'prep_time_minutes',
            'cook_time_minutes', 'servings', 'difficulty',
            'tags', 'tag_ids',
            'equipment', 'equipment_names', # Include the new write-only field
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'author', 'created_at', 'updated_at']

    def _get_or_create_equipment(self, equipment_names_data):
        """Helper to get or create Equipment instances from names."""
        equipment_instances = []
        for name in equipment_names_data:
            name = name.strip()
            if not name:
                continue # Skip empty names

            # Ensure slug uniqueness
            base_slug = slugify(name)
            slug = base_slug
            counter = 1
            while Equipment.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            # Get or create the Equipment instance
            equipment_instance, created = Equipment.objects.get_or_create(
                name=name,
                defaults={'slug': slug} # Only set slug if creating
            )
            equipment_instances.append(equipment_instance)
        return equipment_instances

    def create(self, validated_data):
        # Pop M2M fields with their write_only names
        tag_ids_data = validated_data.pop('tags', [])
        equipment_names_data = validated_data.pop('equipment_names', []) # Pop the new field

        # Create the recipe instance
        recipe = Recipe.objects.create(**validated_data)

        # Set Many-to-Many relationships for tags
        recipe.tags.set(tag_ids_data)

        # NEW: Handle equipment names - get or create Equipment instances
        equipment_instances = self._get_or_create_equipment(equipment_names_data)
        recipe.equipment.set(equipment_instances)

        return recipe

    def update(self, instance, validated_data):
        # Pop M2M fields with their write_only names if present
        tag_ids_data = validated_data.pop('tags', None)
        equipment_names_data = validated_data.pop('equipment_names', None) # Pop the new field

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update Many-to-Many relationships for tags if provided
        if tag_ids_data is not None:
            instance.tags.set(tag_ids_data)

        # NEW: Handle equipment names if provided in the payload
        if equipment_names_data is not None:
            equipment_instances = self._get_or_create_equipment(equipment_names_data)
            instance.equipment.set(equipment_instances) # Set all equipment, effectively replacing old ones

        instance.save()
        return instance
