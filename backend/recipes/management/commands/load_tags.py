from django.core.management.base import BaseCommand, CommandError
from recipes.models import Tag # Import your Tag model

class Command(BaseCommand):
    help = 'Loads a predefined list of tags into the database.'

    def handle(self, *args, **options):
        # The comprehensive list of tags
        tags_list = [
            "Dinner", "Lunch", "Breakfast", "Dessert", "Appetizer", "Snack",
            "Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto", "Paleo",
            "Mediterranean", "Quick & Easy", "Healthy", "Comfort Food",
            "Italian", "Mexican", "Asian", "Indian", "French", "American",
            "Seafood", "Chicken", "Beef", "Pork", "Soup", "Salad", "Pasta",
            "Baking", "Grilling", "Slow Cooker", "One-Pot", "Kid-Friendly",
            "Holiday", "Brunch", "Spicy", "Sweet", "Savory", "Low-Carb",
            "High-Protein", "Budget-Friendly", "Make Ahead", "Freezer-Friendly",
            "Weeknight Meal", "Special Occasion", "Side Dish", "Sauce",
            "Marinade", "Smoothie", "Drink", "Casserole", "Stir-Fry", "Roast",
            "Stew", "Curry", "Bread", "Pastry", "Cake", "Cookies", "Pies",
            "Soufflé", "Muffin", "Pancake", "Waffle", "Omelette", "Scramble",
            "Smoothie Bowl", "Sandwich", "Wrap", "Burger", "Pizza", "Taco",
            "Burrito", "Sushi", "Noodles", "Rice", "Quinoa", "Lentils", "Beans",
            "Vegetables", "Fruits", "Herbs", "Spices", "Nuts", "Seeds", "Grains",
            "Dairy", "Eggs", "Meat", "Poultry", "Fish", "Shellfish",
            "Low-Calorie", "High-Fiber", "Sugar-Free", "Nut-Free", "Soy-Free",
            "Pescatarian", "Whole30", "Raw Vegan", "Air Fryer", "Instant Pot",
            "Sheet Pan", "No-Bake", "Fermented", "Sous Vide", "Thai", "Japanese",
            "Chinese", "Vietnamese", "Korean", "Ethiopian", "Middle Eastern",
            "Greek", "Spanish", "German", "Brazilian", "Caribbean", "Cocktail",
            "Mocktail", "Game Day", "Potluck", "Meal Prep", "Freezer Meal",
            "Umami", "Tangy", "Crispy", "Creamy", "Smoky", "Garlicky"
        ]

        self.stdout.write(self.style.SUCCESS('Starting to load tags...'))
        created_count = 0
        skipped_count = 0

        for tag_name in tags_list:
            try:
                # get_or_create is efficient: it fetches if exists, creates if not
                tag, created = Tag.objects.get_or_create(name=tag_name)
                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Successfully created tag: "{tag_name}"'))
                else:
                    skipped_count += 1
                    self.stdout.write(self.style.WARNING(f'Tag already exists, skipped: "{tag_name}"'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating tag "{tag_name}": {e}'))
                raise CommandError(f'Failed to load tags due to an error with "{tag_name}": {e}')

        self.stdout.write(self.style.SUCCESS(f'\nFinished loading tags.'))
        self.stdout.write(self.style.SUCCESS(f'Total tags created: {created_count}'))
        self.stdout.write(self.style.WARNING(f'Total tags skipped (already existed): {skipped_count}'))

