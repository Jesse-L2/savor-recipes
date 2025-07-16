from django.core.management.base import BaseCommand, CommandError
from recipes.models import Equipment # Import your Equipment model
from django.utils.text import slugify # Import slugify for automatic slug generation

class Command(BaseCommand):
    help = 'Loads a predefined list of cooking equipment into the database.'

    def handle(self, *args, **options):
        # The comprehensive list of equipment
        equipment_list = [
            "Chef's Knife", "Paring Knife", "Bread Knife", "Serrated Knife", "Utility Knife",
            "Cutting Board (Wood)", "Cutting Board (Plastic)", "Mixing Bowls (Set)", "Measuring Cups (Dry)", "Measuring Cups (Wet)",
            "Measuring Spoons", "Liquid Measuring Cup", "Whisk (Balloon)", "Whisk (Flat)",
            "Spatula (Silicone)", "Spatula (Metal)", "Wooden Spoon", "Slotted Spoon",
            "Ladle", "Tongs", "Can Opener", "Bottle Opener", "Vegetable Peeler",
            "Grater (Box)", "Microplane", "Colander", "Strainer (Fine Mesh)",
            "Saucepan (Small)", "Saucepan (Medium)", "Saucepan (Large)", "Stock Pot",
            "Frying Pan (Skillet)", "Cast Iron Skillet", "Non-Stick Pan", "Wok",
            "Dutch Oven", "Roasting Pan", "Baking Sheet (Half Sheet)", "Baking Sheet (Quarter Sheet)",
            "Muffin Tin", "Loaf Pan", "Bundt Pan", "Springform Pan", "Pie Dish",
            "Cooling Rack", "Rolling Pin", "Pastry Brush", "Piping Bag & Tips",
            "Kitchen Scale (Digital)", "Meat Thermometer (Instant-Read)", "Oven Thermometer",
            "Timer", "Blender (Countertop)", "Immersion Blender", "Food Processor",
            "Stand Mixer", "Hand Mixer", "Toaster", "Toaster Oven", "Microwave",
            "Coffee Maker (Drip)", "French Press", "Espresso Machine", "Tea Kettle",
            "Slow Cooker", "Pressure Cooker (Stovetop)", "Instant Pot (Electric Pressure Cooker)",
            "Air Fryer", "Rice Cooker", "Electric Griddle", "Waffle Maker",
            "Electric Kettle", "Juicer (Citrus)", "Juicer (Centrifugal)", "Juicer (Masticating)",
            "Grill (Outdoor)", "Grill Pan (Stovetop)", "Smoker", "Mortar and Pestle",
            "Garlic Press", "Citrus Juicer", "Zester", "Kitchen Shears", "Nutcracker",
            "Corkscrew", "Ice Cream Scoop", "Pizza Cutter", "Pizza Stone",
            "Trivet", "Oven Mitts", "Pot Holders", "Dish Towels", "Apron",
            "Food Storage Containers (Set)", "Vacuum Sealer", "Squeeze Bottles",
            "Mandoline Slicer", "Spiralizer", "Salad Spinner", "Potato Masher",
            "Tenderizer (Meat)", "Pastry Blender", "Dough Scraper", "Cookie Cutters (Set)",
            "Sifter (Flour)", "Candy Thermometer", "Deep Fryer", "Chopsticks",
            "Sushi Rolling Mat", "Taco Holder", "Tortilla Press", "Mortar & Pestle (Mexican)",
            "Tagine", "Wok Spatula", "Steamer Basket (Bamboo)", "Steamer Basket (Metal)",
            "Crab Crackers", "Oyster Shucker", "Fish Spatula", "Grill Tongs",
            "Basting Brush (Grill)", "Skewers (Metal)", "Skewers (Bamboo)", "Chimney Starter",
            "Grill Brush", "Pizza Peel", "Bread Lame", "Proofing Basket (Banneton)",
            "Silicone Baking Mat", "Cookie Scoop", "Candy Molds", "Donut Pan",
            "Popover Pan", "Soufflé Dish", "Ramekins", "Canning Jars (Set)",
            "Canning Funnel", "Jar Lifter", "Food Mill", "Pasta Maker (Manual)",
            "Pasta Maker (Electric)", "Gnocchi Board", "Sausage Stuffer", "Meat Grinder",
            "Dehydrator", "Yogurt Maker", "Bread Machine", "Electric Smoker",
            "Sous Vide Cooker (Immersion Circulator)", "Vacuum Sealer Bags",
            "Spice Grinder (Electric)", "Spice Grinder (Manual)", "Herb Scissors",
            "Egg Slicer", "Apple Corer", "Cherry Pitter", "Strawberry Huller",
            "Corn Holders", "Avocado Slicer", "Pineapple Corer", "Melon Baller",
            "Ice Crusher", "Cocktail Shaker", "Jigger", "Muddler", "Bar Spoon",
            "Wine Aerator", "Wine Stopper", "Champagne Stopper", "Beer Growler",
            "Bottle Brush", "Dish Drying Rack", "Knife Sharpener", "Honing Steel",
            "Butcher Block", "Paper Towel Holder", "Pot Rack", "Utensil Holder",
            "Recipe Box/Stand"
        ]

        self.stdout.write(self.style.SUCCESS('Starting to load equipment...'))
        created_count = 0
        skipped_count = 0

        for equipment_name in equipment_list:
            try:
                # Ensure slug uniqueness for new equipment
                base_slug = slugify(equipment_name)
                slug = base_slug
                counter = 1
                while Equipment.objects.filter(slug=slug).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1

                # get_or_create fetches if exists, creates if not
                equipment, created = Equipment.objects.get_or_create(
                    name=equipment_name,
                    defaults={'slug': slug} # Only set slug if creating
                )
                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Successfully created equipment: "{equipment_name}"'))
                else:
                    skipped_count += 1
                    self.stdout.write(self.style.WARNING(f'Equipment already exists, skipped: "{equipment_name}"'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating equipment "{equipment_name}": {e}'))
                raise CommandError(f'Failed to load equipment due to an error with "{equipment_name}": {e}')

        self.stdout.write(self.style.SUCCESS(f'\nFinished loading equipment.'))
        self.stdout.write(self.style.SUCCESS(f'Total equipment created: {created_count}'))
        self.stdout.write(self.style.WARNING(f'Total equipment skipped (already existed): {skipped_count}'))
