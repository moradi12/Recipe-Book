# API Service Refactoring Migration Guide

## Overview

Your codebase has been refactored to eliminate duplication and follow DRY principles. All API operations are now consolidated into a unified, type-safe architecture.

## Key Changes

### 1. New Architecture

- **BaseApiService**: Foundation class with auth handling and common HTTP methods
- **RecipeService**: Consolidated all recipe operations (user + admin)
- **UserService**: All user-related operations including favorites
- **FavoriteService**: Dedicated favorite management
- **AuthService**: Authentication operations
- **ApiService**: Unified entry point for all services

### 2. Token Management

**Before**: Manual token handling in each method
```typescript
public async createRecipe(recipe: RecipeCreateRequest, token: string)
```

**After**: Automatic token handling via interceptors
```typescript
public async createRecipe(recipe: RecipeCreateRequest)
```

### 3. Usage Examples

#### Old Way
```typescript
import RecipeService from './Service/RecipeService';
import { loginUser } from './Utiles/authService';

// Manual token management
const token = localStorage.getItem('token');
RecipeService.createRecipe(recipeData, token);
```

#### New Way
```typescript
import ApiService from './Service/ApiService';

// Automatic token management
ApiService.recipes.createRecipe(recipeData);
```

## Migration Steps

### Step 1: Update Component Imports

Replace multiple service imports with unified import:

```typescript
// OLD
import RecipeService from '../Service/RecipeService';
import FavoriteService from '../Service/FavoriteService';
import { loginUser } from '../Utiles/authService';

// NEW
import ApiService from '../Service/ApiService';
```

### Step 2: Remove Token Parameters

Update method calls to remove token parameters:

```typescript
// OLD
const result = await RecipeService.createRecipe(recipeData, token);

// NEW
const result = await ApiService.recipes.createRecipe(recipeData);
```

### Step 3: Update Method Names

Some methods have been consolidated:

| Old Method | New Method |
|------------|------------|
| `RecipeService.getAllRecipes()` | `ApiService.recipes.getAllRecipes()` |
| `FavoriteService.getFavorites(token)` | `ApiService.favorites.getFavorites()` |
| `loginUser(data)` | `ApiService.auth.loginUser(data).then(r => r.data)` |
| `updateRecipeAsAdmin(id, data, token)` | `ApiService.recipes.updateRecipeAsAdmin(id, data)` |

### Step 4: Handle Response Structure

Services now return AxiosResponse objects. Extract data:

```typescript
// OLD (functions returned data directly)
const recipes = await fetchRecipes();

// NEW (services return AxiosResponse)
const response = await ApiService.recipes.getAllRecipes();
const recipes = response.data;
```

## Quick Fix for Current Errors

Here are the most common fixes needed:

### 1. Remove Token Parameters
```typescript
// Fix calls like:
RecipeService.createRecipe(recipe, token) 
// To:
ApiService.recipes.createRecipe(recipe)
```

### 2. Update Favorite Service Calls
```typescript
// OLD
FavoriteService.getFavorites(token)
// NEW  
ApiService.favorites.getFavorites()
```

### 3. Handle Response Data
```typescript
// OLD
const result = await someApiCall();
console.log(result.message);

// NEW
const response = await ApiService.someMethod();
console.log(response.data.message);
```

## Backward Compatibility

- All existing files are maintained for backward compatibility
- Legacy functions still work but are marked as `@deprecated`
- Gradually migrate components to use the new ApiService

## Benefits of New Architecture

1. **DRY Principle**: No more duplicated HTTP logic
2. **Automatic Auth**: Token management handled automatically
3. **Type Safety**: Better TypeScript support
4. **Centralized**: Single point for all API operations
5. **Maintainable**: Easier to add new endpoints
6. **Consistent**: Uniform error handling and response format

## Next Steps

1. Update components one by one to use `ApiService`
2. Remove token parameter passing throughout the app
3. Test each updated component
4. Eventually remove deprecated files