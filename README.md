savor-recipes: A Full-Stack Recipe Management System

savor-recipes is a web application designed for users to manage, share, and discover recipes. It features robust user authentication, comprehensive recipe CRUD operations with categorization and tagging, and a user-friendly interface. The backend is powered by Django REST Framework, and the frontend is built with React and styled with Tailwind CSS.
Table of Contents

    Features

    Project Structure

    Technologies Used

    Setup Instructions

        Prerequisites

        Backend Setup (Django)

        Frontend Setup (React)

    Running the Application

    Usage

    API Endpoints

    Contributing

    License

Features

    User Authentication: Email-based registration, login, and JWT-based authentication.

    User Profile Management: Custom user profiles with profile pictures, bios, and public/private visibility.

    Recipe Management:

        Create, Read, Update, Delete (CRUD) recipes.

        Recipes include title, description, images, ingredients (structured), instructions (structured), prep/cook times, servings, difficulty.

        Rating system (placeholder in backend, extendable).

    Categorization & Tagging: Assign recipes to multiple categories and tags for better organization and filtering.

    Equipment Association: Link recipes to specific kitchen equipment.

    Search & Filtering: Easily search recipes by title/description and filter by category, tag, or difficulty.

    Responsive Design: Optimized for various screen sizes using Tailwind CSS.

    Protected Routes: Ensures only authenticated users can access certain parts of the application (e.g., dashboard, recipe creation).

    Admin Interface: Django's powerful admin panel for managing all models.

Project Structure

savor-recipes/
│
├── backend/ # Django backend (API, models, admin, etc.)
│ ├── api/ # API endpoints and views
│ ├── recipes/ # Recipe-related models, admin, serializers
│ ├── users/ # Custom user model, admin, serializers
│ ├── backend/ # Django project settings, URLs
│ ├── manage.py # Django management script
│ ├── requirements.txt # Python dependencies
│ └── .env.example # Example environment variables
│
├── frontend/ # React frontend (Vite + Tailwind)
│ ├── src/ # Source code (components, pages, contexts, services)
│ ├── package.json # JS dependencies
│ ├── postcss.config.js # PostCSS configuration for Tailwind
│ ├── tailwind.config.js # Tailwind CSS configuration
│ ├── vite.config.js # Vite configuration
│ └── .env.example # Example environment variables
│
├── python/ # Utility scripts (e.g., data cleaning - currently empty)
├── README.md # Project documentation
└── pyproject.toml # Python project metadata (optional, for poetry/hatch)

Technologies Used

Backend (Django):

    Python 3.9+

    Django 5.x

    Django REST Framework (DRF)

    djangorestframework-simplejwt for JWT authentication

    psycopg2-binary for PostgreSQL database connectivity

    django-cors-headers for CORS management

    Pillow for image processing

    python-dotenv for environment variable management

    PostgreSQL (as the database)

Frontend (React):

    React 18.x

    Vite (as the build tool)

    Tailwind CSS (for styling)

    Axios (for API requests)

    react-router-dom (for client-side routing)

    React Context API (for state management)

Setup Instructions
Prerequisites

Before you begin, ensure you have the following installed:

    Python 3.9+

    pip (Python package installer)

    Node.js (LTS version recommended)

    npm or yarn (Node.js package manager)

    PostgreSQL (and its client tools)

Backend Setup (Django)

    Navigate to the backend directory:

    cd recipeapp-recipes/backend

    Create a Python virtual environment and activate it:

    python -m venv venv
    # On Windows:
    # .\venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate

    Install Python dependencies:

    pip install -r requirements.txt

    Create a .env file:
    Copy the .env.example file to .env and fill in your database credentials and a strong SECRET_KEY.

    cp .env.example .env

    Edit the .env file:

    # Example .env content
    SECRET_KEY=your_very_strong_and_unique_django_secret_key
    DB_NAME=recipeapp_db
    DB_USER=recipeapp_user
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    ALLOWED_HOSTS=127.0.0.1,localhost
    CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
    DEBUG=True

    Note: Ensure CORS_ALLOWED_ORIGINS includes your frontend's development URL (e.g., http://localhost:5173).

    Set up PostgreSQL database:
    Create the database and user as specified in your .env file.

    -- Example PostgreSQL commands (run in psql)
    CREATE DATABASE recipeapp_db;
    CREATE USER recipeapp_user WITH PASSWORD 'your_db_password';
    GRANT ALL PRIVILEGES ON DATABASE recipeapp_db TO recipeapp_user;

    Run Django migrations:
    This will create the necessary database tables.

    python manage.py makemigrations
    python manage.py migrate

    Create a Django superuser (for admin access):

    python manage.py createsuperuser

    Follow the prompts to create an admin user.

Frontend Setup (React)

    Navigate to the frontend directory:

    cd recipeapp-recipes/frontend

    Install Node.js dependencies:

    npm install
    # or yarn install

    Create a .env file for the frontend:
    This file will tell your React app where to find the backend API.

    cp .env.example .env

    Edit the .env file:

    # Example .env content for frontend
    VITE_API_BASE_URL=http://localhost:8000/api

Running the Application

    Start the Django Backend Server:
    From the backend/ directory (with virtual environment activated):

    python manage.py runserver

    The backend API will be available at http://localhost:8000/api/. The Django admin will be at http://localhost:8000/admin/.

    Start the React Frontend Development Server:
    From the frontend/ directory:

    npm run dev
    # or yarn dev

    The frontend application will typically open in your browser at http://localhost:5173/ (or another available port).

Usage

    Register: Create a new user account via the /register page.

    Login: Log in with your registered email and password via the /login page.

    Browse Recipes: Explore recipes on the home page. Use the search bar and filters to find specific recipes.

    Create Recipe: Authenticated users can create new recipes via the "Add Recipe" link on the Navbar or Dashboard.

    View Recipe Details: Click on any recipe card to see its full details, including ingredients, instructions, and author information.

    Edit/Delete Recipe: If you are the author of a recipe, you will see "Edit Recipe" and "Delete Recipe" buttons on the recipe detail page.

    Dashboard: Access your personal dashboard to view and manage your own recipes.

    Profile: Update your profile information, including your profile picture and bio, from the "Profile" page.

API Endpoints

Authentication:

    POST /api/token/ - Obtain JWT access and refresh tokens (login).

    POST /api/token/refresh/ - Refresh access token using refresh token.

    POST /api/users/register/ - Register a new user.

    GET, PATCH /api/users/profile/ - Retrieve or update the authenticated user's profile.

Recipes:

    GET, POST /api/recipes/recipes/ - List all recipes or create a new recipe.

        Query parameters for filtering: ?search=<query>, ?categories__slug=<slug>, ?tags__slug=<slug>, ?difficulty=<level>, ?author__id=<uuid>.

    GET, PUT, PATCH, DELETE /api/recipes/recipes/<slug>/ - Retrieve, update, or delete a specific recipe by slug.

Categories, Tags, Equipment (Read-only):

    GET /api/recipes/categories/ - List all categories.

    GET /api/recipes/tags/ - List all tags.

    GET /api/recipes/equipment/ - List all equipment.

Contributing

Contributions are welcome! Please follow these steps:

    Fork the repository.

    Create a new branch (git checkout -b feature/your-feature-name).

    Make your changes.

    Commit your changes (git commit -m 'Add new feature').

    Push to the branch (git push origin feature/your-feature-name).

    Open a Pull Request.
