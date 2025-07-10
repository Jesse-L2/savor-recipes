from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Recipe, Tag, Equipment # Removed Category
from .serializers import RecipeSerializer, TagSerializer, EquipmentSerializer
from .permissions import IsAuthorOrReadOnly

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows tags to be viewed.
    This now serves both original 'categories' and 'tags'.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny] # Tags are public
    lookup_field = 'slug' # Allow looking up by slug

class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows equipment to be viewed.
    """
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.AllowAny] # Equipment is public
    lookup_field = 'slug'

class RecipeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows recipes to be created, viewed, edited or deleted.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthorOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'tags__slug': ['exact'], # Filter by tag slug (now includes former categories)
        'difficulty': ['exact'],
    }
    search_fields = ['title', 'description', 'ingredients__item', 'tags__name', 'equipment__name']
    ordering_fields = ['created_at', 'title', 'difficulty']
    ordering = ['-created_at'] # Default ordering

    def perform_create(self, serializer):
        """
        Sets the author of the recipe to the currently authenticated user.
        Slug generation is handled by the model's save method via pre_save signal.
        """
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """
        Updates the recipe. Slug regeneration (if title changes) is handled
        by the model's save method via pre_save signal.
        """
        serializer.save()


    def get_queryset(self):
        """
        Optionally restricts the returned recipes to a given user,
        by filtering against a `author_id` query parameter in the URL.
        """
        queryset = super().get_queryset()
        author_id = self.request.query_params.get('author_id', None)
        if author_id is not None:
            queryset = queryset.filter(author__id=author_id)
        return queryset

