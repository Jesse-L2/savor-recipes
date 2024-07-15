from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from recipes.views import CreateUserView
from rest_framework.routers import DefaultRouter
from recipes.views import RecipeViewSet

router = DefaultRouter()

urlpatterns = [
    path('', RecipeViewSet.as_view({'get':'list'}), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('recipes.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/user/register/', CreateUserView.as_view(), name='register')
]
