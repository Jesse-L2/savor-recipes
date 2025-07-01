from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'equipment', views.EquipmentViewSet, basename='equipment')

urlpatterns = [
    path('recipes/', views.RecipeListCreate.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', views.RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe-detail'),
    path('recipes/delete/<int:pk>', views.RecipeDelete.as_view(), name='delete-recipe'),
    path('', include(router.urls)),
]