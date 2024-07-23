from django.urls import path, include
from . import views



urlpatterns = [
    
    path('recipes/', views.RecipeListCreate.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe-detail'),
    path('recipes/delete/<int:pk>', views.RecipeDelete.as_view(), name='delete-recipe'),

]