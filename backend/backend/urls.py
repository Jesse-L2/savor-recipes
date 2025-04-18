from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from recipes.views import RecipeViewSet, RecipeDelete
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RecipeViewSet.as_view({'get':'list'}), name='home'),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/recipes/', include('recipes.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
