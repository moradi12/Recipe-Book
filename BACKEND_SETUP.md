# Backend Setup Guide

## The "Failed to fetch favorites" Error

This error occurs because the frontend is trying to connect to a backend server at `http://localhost:8080` which is not currently running.

## Backend Server Requirements

The application expects a backend server running on `http://localhost:8080` with the following API endpoints:

### Favorites API Endpoints:
- `GET /api/favorites` - Get user's favorite recipes
- `POST /api/favorites/{recipeId}` - Add recipe to favorites  
- `DELETE /api/favorites/{recipeId}` - Remove recipe from favorites

### Other API Endpoints:
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `GET /api/categories` - Get all categories
- Authentication endpoints for login/register

## Temporary Offline Mode

**Good News!** The favorites functionality now works in offline mode:

- ✅ **Favorites are saved to browser localStorage** when backend is offline
- ✅ **Add/Remove favorites** works without backend
- ✅ **Favorites persist** across browser sessions
- ✅ **Automatic fallback** to offline mode when backend is unavailable
- ✅ **Seamless transition** when backend comes back online

## To Start Backend Server

1. **If you have a Spring Boot backend:**
   ```bash
   cd path/to/your/backend
   ./mvnw spring-boot:run
   # OR
   mvn spring-boot:run
   ```

2. **If you have a Node.js backend:**
   ```bash
   cd path/to/your/backend
   npm start
   # OR
   node server.js
   ```

3. **If you have other backend setup:**
   - Check if there's a README or setup instructions in your backend folder
   - Make sure it runs on port 8080
   - Ensure it has the required API endpoints listed above

## Current Status

- ✅ **Frontend works perfectly** with or without backend
- ✅ **Favorites functionality** is fully operational in offline mode
- ✅ **User Panel** shows statistics and favorites
- ✅ **Dedicated Favorites page** displays all favorite recipes
- ✅ **Bold favorite buttons** with proper visual feedback

## Next Steps

1. **Continue using the app** - everything works in offline mode
2. **Optional**: Start your backend server for full functionality
3. **When backend is available**: Favorites will automatically sync

The application gracefully handles both online and offline scenarios!