from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Removed CategoryViewSet import as it no longer exists
from .views import TagViewSet, EquipmentViewSet, RecipeViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
# Removed registration for categories as they are now part of tags
router.register(r'tags', TagViewSet) # This now includes previous categories
router.register(r'equipment', EquipmentViewSet)
router.register(r'recipes', RecipeViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
