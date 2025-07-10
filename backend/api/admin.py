# from django.contrib import admin

# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import CustomUser

# @admin.register(CustomUser)
# class CustomUserAdmin(UserAdmin):
#     """
#     Custom Admin interface for the CustomUser model.
#     Uses the custom forms for adding and changing users.
#     """
#     model = CustomUser
#     list_display = [
#         'username',
#         'email',
#         'first_name',
#         'last_name',
#         'is_staff',
#         'is_chef', # Display your custom field in the list view
#     ]
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {'fields': ('bio', 'profile_picture', 'favorite_cuisine', 'is_chef',)}),
#     )
#     add_fieldsets = UserAdmin.add_fieldsets + (
#         (None, {'fields': ('bio', 'profile_picture', 'favorite_cuisine', 'is_chef', 'email',)}),
#     )
