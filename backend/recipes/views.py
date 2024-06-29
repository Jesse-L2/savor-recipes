from django.shortcuts import render
from .models import Author, Recipe

# Create your views here.
def recipesView(request):
    recipes = Recipe.objects.all()
    return render(request, 'recipes.html', {'recipes': recipes})