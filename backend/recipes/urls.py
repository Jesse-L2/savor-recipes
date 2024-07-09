from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet
from . import views

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recipes/', views.RecipeViewSet.as_view({'get':'list'}), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view(), name='recipe-detail'),
    path('recipes/delete/<int:pk>', views.RecipeDelete.as_view(), name='delete-recipe'),
]