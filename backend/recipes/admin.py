from django.contrib import admin
from .models import Recipe, Tag, Equipment

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'difficulty', 'created_at')
    list_filter = ('difficulty', 'tags') # Update filter to use 'tags'
    search_fields = ('title', 'description', 'author__email')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags', 'equipment') # Update filter_horizontal

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

# Remove unregistering of Category if you had it, as the model is gone
