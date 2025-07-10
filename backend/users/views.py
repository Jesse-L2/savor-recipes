from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import CustomUser

class UserRegistrationView(APIView):
    """
    API view for user registration.
    Allows any user to register a new account.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handles POST requests for user registration.
        Validates data using UserRegistrationSerializer and creates a new user.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(RetrieveUpdateAPIView):
    """
    API view for retrieving and updating the authenticated user's profile.
    Requires authentication.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Returns the CustomUser instance associated with the authenticated user.
        """
        return self.request.user

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests to retrieve the user's profile.
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Handles PUT requests to fully update the user's profile.
        """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Handles PATCH requests to partially update the user's profile.
        """
        return self.partial_update(request, *args, **kwargs)

class CustomUserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed.
    Provides read-only operations for CustomUser instances.
    """
    queryset = CustomUser.objects.filter(is_active=True, is_public=True) # Only show active and public users
    serializer_class = UserProfileSerializer # Reuse UserProfileSerializer for viewing
    permission_classes = [AllowAny] # Allow anyone to view public profiles
    lookup_field = 'id' # Assuming you want to look up users by their UUID

