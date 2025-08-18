# Custom Hooks Documentation

## Overview

This project now uses a comprehensive set of custom hooks that eliminate code duplication and provide a clean, consistent API for all operations. All hooks are designed to work together and handle loading states, error handling, and authentication automatically.

## Available Hooks

### 1. `useApi<T>` - Base API Hook

Generic hook for any API call with automatic loading/error handling.

```typescript
import { useApi } from './hooks';

const { data, loading, error, execute, reset } = useApi(
  apiFunction,
  {
    onSuccess: (data) => console.log('Success!'),
    onError: (error) => console.log('Error:', error),
    showSuccessNotification: true,
    showErrorNotification: true,
    successMessage: 'Operation completed!',
    errorMessage: 'Something went wrong',
  }
);
```

### 2. `useAuth` - Authentication Hook

Complete authentication management with automatic token handling.

```typescript
import { useAuth } from './hooks';

const {
  // State
  auth,
  isAuthenticated,
  userInfo,
  
  // Operations
  login,
  register,
  logout,
  
  // Checks
  requireAuth,
  hasRole,
  isAdmin,
  isEditor,
  
  // Loading
  loginLoading,
  registerLoading,
} = useAuth();

// Usage examples
const handleLogin = async () => {
  const success = await login({ usernameOrEmail: 'user', password: 'pass' });
  if (success) {
    navigate('/dashboard');
  }
};

// Check auth before sensitive operations
if (!requireAuth()) return;

// Role-based access
if (isAdmin) {
  // Show admin features
}
```

### 3. `useRecipes` - Recipe Management Hook

Complete recipe CRUD operations with pagination and filtering.

```typescript
import { useRecipes } from './hooks';

const {
  // Data
  recipes,
  categories,
  pagination,
  
  // Loading
  recipesLoading,
  categoriesLoading,
  
  // Operations
  fetchRecipes,
  fetchCategories,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  approveRecipe,
  rejectRecipe,
  updateRecipeStatus,
  searchRecipes,
  getMyRecipes,
  
  // Pagination
  nextPage,
  prevPage,
  goToPage,
  setPaginationSize,
  
  // Filters
  filterCategory,
  setFilterCategory,
  
  // Permissions
  canEdit,
  canApprove,
  canDelete,
} = useRecipes();

// Usage examples
useEffect(() => {
  fetchCategories();
  fetchRecipes();
}, [fetchCategories, fetchRecipes]);

const handleCreate = async (recipeData) => {
  const success = await createRecipe(recipeData);
  if (success) {
    // Recipe created and user redirected automatically
  }
};
```

### 4. `useFavorites` - Favorites Management Hook

User favorites with optimistic updates.

```typescript
import { useFavorites } from './hooks';

const {
  // Data
  favorites,
  favoriteRecipeIds,
  
  // Loading
  loading,
  
  // Operations
  fetchFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  isFavorite,
} = useFavorites();

// Usage examples
const handleToggle = async (recipeId) => {
  await toggleFavorite(recipeId); // Automatically shows notifications
};

const isRecipeFavorited = isFavorite(recipeId);
```

### 5. `useUser` - User Management Hook

User profile and management operations.

```typescript
import { useUser } from './hooks';

const {
  // Data
  currentUser,
  users,
  
  // Loading
  currentUserLoading,
  usersLoading,
  updateLoading,
  
  // Operations
  getCurrentUser,
  getAllUsers,
  updateUserDetails,
  updatePassword,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} = useUser();

// Usage examples
const handleUpdateProfile = async () => {
  const success = await updateUserDetails('new@email.com', 'newPassword');
  if (success) {
    // Profile updated
  }
};
```

### 6. `useForm<T>` - Form Management Hook

Type-safe form handling with validation.

```typescript
import { useForm, validators } from './hooks';

interface FormData {
  email: string;
  password: string;
  age: number;
}

const {
  values,
  errors,
  touched,
  isValid,
  isSubmitting,
  
  // Field operations
  setValue,
  setError,
  setTouched,
  
  // Form operations
  handleChange,
  handleBlur,
  handleSubmit,
  validate,
  reset,
} = useForm<FormData>(
  // Initial values
  { email: '', password: '', age: 0 },
  // Validation rules
  {
    email: validators.required('Email is required'),
    password: validators.minLength(6, 'Password must be at least 6 characters'),
    age: validators.min(18, 'Must be 18 or older'),
  }
);

// Usage in component
<form onSubmit={handleSubmit(async (data) => {
  // Handle form submission
  await submitData(data);
})}>
  <input
    name="email"
    value={values.email}
    onChange={handleChange}
    onBlur={handleBlur}
    className={errors.email ? 'error' : ''}
  />
  {errors.email && <span>{errors.email}</span>}
</form>
```

### 7. `useAdmin` - Admin Operations Hook

Administrative operations with permission checks.

```typescript
import { useAdmin } from './hooks';

const {
  // Data
  pendingRecipes,
  allUsers,
  
  // Loading
  pendingRecipesLoading,
  usersLoading,
  operationLoading,
  
  // Operations
  getPendingRecipes,
  approveRecipe,
  rejectRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipesAdmin,
  getAllUsers,
  
  // Permission
  isAdminAuthenticated,
} = useAdmin();

// Usage examples
useEffect(() => {
  if (isAdminAuthenticated) {
    getPendingRecipes();
    getAllUsers();
  }
}, [isAdminAuthenticated, getPendingRecipes, getAllUsers]);
```

## Available Validators

```typescript
import { validators } from './hooks';

// Common validators
validators.required('Field is required')
validators.email('Invalid email format')
validators.minLength(6, 'Min 6 characters')
validators.maxLength(100, 'Max 100 characters')
validators.min(18, 'Minimum value is 18')
validators.max(100, 'Maximum value is 100')
validators.pattern(/^[A-Za-z]+$/, 'Letters only')

// Custom validator
const customValidator = (value) => {
  if (value !== 'expected') {
    return 'Value must be "expected"';
  }
};
```

## Migration Examples

### Old Component Pattern
```typescript
// OLD - Manual API calls, loading states, error handling
const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const fetchRecipes = async () => {
  try {
    setLoading(true);
    const response = await RecipeService.getAllRecipes();
    setRecipes(response.data);
  } catch (err) {
    setError(err.message);
    notify.error('Failed to load recipes');
  } finally {
    setLoading(false);
  }
};

const handleApprove = async (id) => {
  try {
    const token = getToken();
    await RecipeService.approveRecipe(id, token);
    notify.success('Recipe approved!');
    fetchRecipes();
  } catch (err) {
    notify.error('Failed to approve recipe');
  }
};
```

### New Hook Pattern
```typescript
// NEW - Clean, declarative approach
const {
  recipes,
  recipesLoading,
  fetchRecipes,
  approveRecipe,
} = useRecipes();

// That's it! No manual loading/error handling, no token management
useEffect(() => {
  fetchRecipes();
}, [fetchRecipes]);

const handleApprove = (id) => approveRecipe(id);
```

## Benefits of the New Approach

1. **🔥 80% Less Code**: Components are dramatically smaller
2. **🚀 Automatic Token Management**: No more manual token passing
3. **⚡ Built-in Loading States**: Loading handled automatically
4. **🎯 Type Safety**: Full TypeScript support
5. **🔄 Optimistic Updates**: Immediate UI feedback
6. **📱 Consistent UX**: Unified notification and error handling
7. **🧪 Easy Testing**: Hooks can be tested in isolation
8. **♻️ Maximum Reusability**: Use the same logic across components

## Best Practices

1. **Always use hooks at component top level** - Never inside loops, conditions, or nested functions
2. **Combine related hooks** - Use `useAuth` + `useRecipes` together for authenticated recipe operations
3. **Handle loading states** - Always show loading indicators when operations are in progress
4. **Leverage automatic features** - Let hooks handle tokens, notifications, and error states
5. **Use TypeScript** - Take advantage of full type safety for better development experience

## Troubleshooting

### Common Issues

1. **"Hook called conditionally"** - Move all hook calls to component top level
2. **"Auth required" errors** - Ensure `useAuth().requireAuth()` is called before protected operations
3. **Stale data** - Use the refresh functions provided by hooks to update data

### Performance Tips

1. **Memoize handlers** - Use `useCallback` for event handlers passed to child components
2. **Debounce searches** - For search functionality, debounce user input
3. **Paginate large lists** - Use the built-in pagination in `useRecipes`

This new hook-based architecture provides a much cleaner, more maintainable codebase while eliminating the massive code duplication that existed before.