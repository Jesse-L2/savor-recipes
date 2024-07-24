from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from recipes.views import CreateUserView, RecipeViewSet, RecipeDelete
from rest_framework.routers import DefaultRouter


router = DefaultRouter()

urlpatterns = [
    path('', RecipeViewSet.as_view({'get':'list'}), name='home'),
    path('admin/', admin.site.urls),
    path('recipes/', include('recipes.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
]
