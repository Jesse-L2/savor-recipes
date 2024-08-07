from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from recipes.views import CreateUserView, RecipeViewSet, RecipeDelete
from rest_framework.routers import DefaultRouter


router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api-auth/', include('rest_framework.urls')),
    path('', RecipeViewSet.as_view({'get':'list'}), name='home'),
    path('recipes/', include('recipes.urls')),
]
