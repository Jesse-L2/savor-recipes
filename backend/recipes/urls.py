from django.urls import path, include
from .views import RecipeViewSet
from . import views



urlpatterns = [
    
    path('recipes/', views.RecipeViewSet.as_view({'get':'list'}), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe-detail'),
    path('recipes/delete/<int:pk>', views.RecipeDelete.as_view(), name='delete-recipe'),
]