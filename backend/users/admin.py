from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Customizes the Django admin interface for the CustomUser model.
    Inherits from UserAdmin to leverage existing user management features
    and adds custom fields.
    """
    # Fields to display in the list view
    list_display = (
        'email', 'first_name', 'last_name', 'is_staff', 'is_active',
        'is_public', 'recipe_count', 'date_joined'
    )
    # Fields to filter by in the list view
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'is_public')
    # Fields to search by
    search_fields = ('email', 'first_name', 'last_name')
    # Fields to order by
    ordering = ('email',)

    # Fieldsets for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2'),
        }),
        ('Personal info', {'fields': ('first_name', 'last_name', 'profile_picture', 'bio')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Profile Settings', {'fields': ('is_public',)}),
    )

    # Fieldsets for the change user form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'profile_picture', 'bio')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Profile Settings', {'fields': ('is_public', 'recipe_count')}),
    )

    # Make 'password2' available in the add form
    add_form_template = 'admin/auth/user/add_form.html' # Default template for user add form

    # Override the default form to include custom fields if needed,
    # though fieldsets handle most of it.
    # form = CustomUserChangeForm # If you create a custom form for change
    # add_form = CustomUserCreationForm # If you create a custom form for add

    # Ensure recipe_count is read-only in the admin, as it's updated programmatically
    readonly_fields = ('recipe_count', 'date_joined', 'last_login')
