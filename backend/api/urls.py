from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, UserViewSet, current_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterUserView, get_csrf_token
from django.views.decorators.csrf import csrf_exempt

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', csrf_exempt(RegisterUserView.as_view()), name='register'),
    path('users/current/', current_user, name='current_user'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
]