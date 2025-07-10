from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserRegistrationView, UserProfileView, CustomUserViewSet # Import CustomUserViewSet

router = DefaultRouter()
router.register(r'', CustomUserViewSet, basename='users') # Register CustomUserViewSet

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('', include(router.urls)), # Include router URLs here
]