from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from .models import Recipe, Author
from .serializers import RecipeSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    def get_self_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(author_id=user.id)
    
    def perform_create(self, serializer):
        # override create w/ custom create
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class RecipeDelete(generics.DestroyAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Recipe.objects
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]