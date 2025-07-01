from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics
from .models import Recipe, Category, Tag, Equipment
from .serializers import RecipeSerializer, CategorySerializer, TagSerializer, EquipmentSerializer
from users.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Django view is a Python function that takes http requests and returns an http response
class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]
    def get_self_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(author_id=user.id)
    
    def perform_create(self, serializer):
        # override create w/ custom create
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class RecipeListCreate(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recipe.objects.all()
    
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
    
User = get_user_model()
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [AllowAny]