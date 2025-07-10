from django.urls import path, include

urlpatterns = [
    # Include user-related API URLs
    path('users/', include('users.urls')),
    # Include recipe-related API URLs
    path('recipes/', include('recipes.urls')),
    # You can add more general API endpoints here if needed
]
