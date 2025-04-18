from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, UserViewSet, current_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from recipes.views import CreateUserView

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('users/current/', current_user, name='current_user'),
]