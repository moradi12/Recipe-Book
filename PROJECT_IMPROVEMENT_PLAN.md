# Recipe Book Project - Improvement Plan

## Executive Summary
This document outlines critical improvements needed for the Recipe Book project, prioritized by security, architecture, performance, and maintainability concerns.

---

## 🔴 **PHASE 1: CRITICAL SECURITY FIXES (Week 1)**

### 1.1 Database Security
**Issue**: Hardcoded credentials in `application.yml`

**Current (Vulnerable)**:
```yaml
datasource:
  username: root
  password: 12345678  # SECURITY RISK!
```

**Fix**:
```yaml
datasource:
  username: ${DB_USERNAME:root}
  password: ${DB_PASSWORD}
  url: ${DB_URL:jdbc:mysql://localhost:3306/fiesta}
```

**Action Items**:
- [ ] Create `.env` file for environment variables
- [ ] Update `application.yml` to use environment variables
- [ ] Add `.env` to `.gitignore`
- [ ] Update deployment scripts

### 1.2 Admin Credentials Security
**Issue**: Hardcoded admin credentials

**Current (Vulnerable)**:
```yaml
admin:
  email: admin@admin.com
  password: admin  # WEAK PASSWORD!
```

**Fix**:
```yaml
admin:
  email: ${ADMIN_EMAIL}
  password: ${ADMIN_PASSWORD}
```

**Action Items**:
- [ ] Generate strong admin password
- [ ] Move to environment variables
- [ ] Implement password hashing verification

### 1.3 JWT Token Management
**Issue**: Multiple inconsistent token storage locations

**Current Problems**:
- `sessionStorage.jwt`
- `localStorage.token`
- Redux store conflicts

**Solution**: Create centralized token manager

**File**: `src/utils/tokenManager.ts`
```typescript
const TOKEN_KEY = 'app_token';

export const tokenManager = {
  setToken: (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    // Remove old storage locations
    localStorage.removeItem('token');
    sessionStorage.removeItem('jwt');
  },
  
  getToken: () => sessionStorage.getItem(TOKEN_KEY),
  
  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
    sessionStorage.removeItem('jwt');
  },
  
  isValid: () => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};
```

**Action Items**:
- [ ] Create tokenManager utility
- [ ] Update BaseApiService to use tokenManager
- [ ] Remove redundant token storage code
- [ ] Update all hooks to use tokenManager

### 1.4 XSS Protection
**Issue**: Unvalidated base64 images

**Current (Vulnerable)**:
```typescript
<img src={`data:image/png;base64,${recipe.photo}`} alt={recipe.title} />
```

**Fix**: Add image validation
```typescript
const SafeImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    // Validate base64 image format
    const isValidBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(src);
    setIsValid(isValidBase64);
  }, [src]);
  
  if (!isValid) return <div className="image-placeholder">Invalid Image</div>;
  
  return <img src={`data:image/png;base64,${src}`} alt={alt} />;
};
```

**Action Items**:
- [ ] Create SafeImage component
- [ ] Replace all direct base64 image usage
- [ ] Add image validation on backend
- [ ] Implement Content Security Policy headers

---

## 🟡 **PHASE 2: ARCHITECTURE IMPROVEMENTS (Week 2)**

### 2.1 Environment Configuration
**File**: `src/config/environment.ts`
```typescript
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  JWT_EXPIRY_HOURS: parseInt(import.meta.env.VITE_JWT_EXPIRY_HOURS || '24'),
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  PAGINATION_SIZE: 12,
};

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
```

**Action Items**:
- [ ] Create environment configuration
- [ ] Update all hardcoded URLs and values
- [ ] Create `.env.example` file
- [ ] Document environment variables

### 2.2 Standardize API Service Pattern
**Issue**: Mix of direct axios calls and service classes

**File**: `src/services/apiClient.ts`
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config/environment';
import { tokenManager } from '../utils/tokenManager';
import { errorHandler } from '../utils/errorHandler';

class ApiClient {
  private static instance: AxiosInstance;
  
  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: config.API_BASE_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.setupInterceptors();
    }
    return this.instance;
  }
  
  private static setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = tokenManager.getToken();
        if (token && tokenManager.isValid()) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        errorHandler.handle(error);
        return Promise.reject(error);
      }
    );
  }
}

export default ApiClient;
```

**Refactor All Services**:
```typescript
// services/RecipeService.ts
import ApiClient from './apiClient';
import { Recipe, RecipeFilters, PaginatedRecipes } from '../types/recipe';

export class RecipeService {
  private client = ApiClient.getInstance();
  
  async getRecipes(filters: RecipeFilters): Promise<PaginatedRecipes> {
    const response = await this.client.get('/recipes', { params: filters });
    return response.data;
  }
  
  async getRecipeById(id: number): Promise<Recipe> {
    const response = await this.client.get(`/recipes/${id}`);
    return response.data;
  }
  
  async createRecipe(recipe: CreateRecipeRequest): Promise<Recipe> {
    const response = await this.client.post('/recipes', recipe);
    return response.data;
  }
  
  async updateRecipe(id: number, recipe: UpdateRecipeRequest): Promise<Recipe> {
    const response = await this.client.put(`/recipes/${id}`, recipe);
    return response.data;
  }
  
  async deleteRecipe(id: number): Promise<void> {
    await this.client.delete(`/recipes/${id}`);
  }
}

export default new RecipeService();
```

**Action Items**:
- [ ] Create centralized API client
- [ ] Refactor all services to use unified pattern
- [ ] Remove direct axios calls from hooks
- [ ] Update error handling consistently

### 2.3 Error Handling System
**File**: `src/utils/errorHandler.ts`
```typescript
import { AxiosError } from 'axios';
import { tokenManager } from './tokenManager';
import { notify } from './notification';
import { logger } from './logger';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
      code: error.code,
      details: error.response?.data,
    };
    
    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        apiError.message = 'Authentication required';
        tokenManager.removeToken();
        window.location.href = '/login';
        break;
        
      case 403:
        apiError.message = 'Access denied';
        break;
        
      case 404:
        apiError.message = 'Resource not found';
        break;
        
      case 422:
        apiError.message = 'Invalid data provided';
        break;
        
      case 500:
        apiError.message = 'Server error - please try again later';
        break;
        
      default:
        apiError.message = error.response?.data?.message || error.message;
    }
    
    // Log error
    logger.error(`API Error [${apiError.status}]: ${apiError.message}`, error);
    
    // Show user notification
    if (apiError.status !== 401) { // Don't show notification for auth redirects
      notify.error(apiError.message);
    }
    
    return apiError;
  }
}

export const errorHandler = ErrorHandler;
```

**File**: `src/components/ErrorBoundary.tsx`
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

**Action Items**:
- [ ] Create centralized error handler
- [ ] Add error boundary to main App component
- [ ] Update all catch blocks to use errorHandler
- [ ] Implement user-friendly error messages

---

## 🟠 **PHASE 3: PERFORMANCE OPTIMIZATION (Week 3)**

### 3.1 Code Splitting & Lazy Loading
**File**: `src/App.tsx`
```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const RecipeList = lazy(() => import('./Pages/GetAllRecipes/GetAllRecipes'));
const RecipeDetail = lazy(() => import('./Pages/GetSingleRecipe/GetSingleRecipe'));
const CreateRecipe = lazy(() => import('./Pages/AddRecipe/CreateRecipe'));
const EditRecipe = lazy(() => import('./Pages/EditRecipe/EditRecipe'));
const UserProfile = lazy(() => import('./Pages/UserProfile/UserProfile'));
const Favorites = lazy(() => import('./Pages/Favorites/Favorites'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

**Action Items**:
- [ ] Implement lazy loading for all route components
- [ ] Add loading spinner component
- [ ] Wrap app in error boundary
- [ ] Test bundle size reduction

### 3.2 Component Optimization
**Optimize Heavy Components**:
```typescript
// components/RecipeCard.tsx
import { memo, useCallback } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle: (id: number) => void;
  isFavorite: boolean;
}

export const RecipeCard = memo<RecipeCardProps>(({ 
  recipe, 
  onFavoriteToggle, 
  isFavorite 
}) => {
  const handleFavoriteClick = useCallback(() => {
    onFavoriteToggle(recipe.id);
  }, [recipe.id, onFavoriteToggle]);
  
  return (
    <div className="recipe-card">
      {/* Component content */}
      <button onClick={handleFavoriteClick}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';
```

**Action Items**:
- [ ] Add React.memo to expensive components
- [ ] Use useCallback for event handlers
- [ ] Implement useMemo for expensive calculations
- [ ] Add React DevTools Profiler analysis

### 3.3 State Management Optimization
**Consider RTK Query for cleaner data fetching**:
```typescript
// store/api/recipesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenManager } from '../../utils/tokenManager';

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/recipes',
    prepareHeaders: (headers) => {
      const token = tokenManager.getToken();
      if (token && tokenManager.isValid()) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Recipe', 'Favorite'],
  endpoints: (builder) => ({
    getRecipes: builder.query<PaginatedRecipes, RecipeFilters>({
      query: (filters) => ({ url: '', params: filters }),
      providesTags: ['Recipe'],
    }),
    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
    }),
    addFavorite: builder.mutation<void, number>({
      query: (id) => ({ url: `/favorites/${id}`, method: 'POST' }),
      invalidatesTags: ['Favorite'],
    }),
    removeFavorite: builder.mutation<void, number>({
      query: (id) => ({ url: `/favorites/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = recipesApi;
```

**Action Items**:
- [ ] Evaluate RTK Query implementation
- [ ] Reduce Redux boilerplate
- [ ] Implement optimistic updates
- [ ] Add proper caching strategies

---

## 🟢 **PHASE 4: TESTING & MONITORING (Week 4)**

### 4.1 Testing Infrastructure
**Setup Files**:

**File**: `src/test-utils.tsx`
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

**Sample Tests**:
```typescript
// components/__tests__/RecipeCard.test.tsx
import { render, screen, fireEvent } from '../test-utils';
import { RecipeCard } from '../RecipeCard';

const mockRecipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'Test description',
  cookingTime: 30,
  servings: 4,
};

describe('RecipeCard', () => {
  it('renders recipe information', () => {
    render(
      <RecipeCard 
        recipe={mockRecipe}
        onFavoriteToggle={() => {}}
        isFavorite={false}
      />
    );
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('30 mins')).toBeInTheDocument();
  });
  
  it('calls onFavoriteToggle when favorite button clicked', () => {
    const mockToggle = jest.fn();
    
    render(
      <RecipeCard 
        recipe={mockRecipe}
        onFavoriteToggle={mockToggle}
        isFavorite={false}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalledWith(1);
  });
});
```

**Action Items**:
- [ ] Setup Jest and React Testing Library
- [ ] Create test utilities
- [ ] Write unit tests for components
- [ ] Write tests for hooks and services
- [ ] Implement integration tests
- [ ] Add CI/CD test pipeline

### 4.2 Logging System
**File**: `src/utils/logger.ts`
```typescript
import { config, isDevelopment } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (isDevelopment) return true;
    return level === 'warn' || level === 'error';
  }
  
  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
  
  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, data);
    }
  }
  
  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, data);
    }
  }
  
  error(message: string, error?: Error | any) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error);
      
      // Send to monitoring service in production
      if (!isDevelopment && window.gtag) {
        window.gtag('event', 'exception', {
          description: message,
          fatal: false,
        });
      }
    }
  }
}

export const logger = new Logger();
```

**Action Items**:
- [ ] Replace all console.log statements
- [ ] Implement structured logging
- [ ] Add error monitoring (Sentry)
- [ ] Setup performance monitoring

---

## 📋 **IMPLEMENTATION CHECKLIST**

### Week 1: Critical Security
- [ ] Move database credentials to environment variables
- [ ] Implement tokenManager utility  
- [ ] Fix admin credential security
- [ ] Add XSS protection for images
- [ ] Create .env.example file
- [ ] Update .gitignore

### Week 2: Architecture
- [ ] Create environment configuration
- [ ] Implement centralized API client
- [ ] Refactor all services
- [ ] Create error handling system
- [ ] Add error boundary to app
- [ ] Remove direct axios usage

### Week 3: Performance  
- [ ] Implement lazy loading for routes
- [ ] Add React.memo to components
- [ ] Optimize expensive operations
- [ ] Consider RTK Query migration
- [ ] Add loading spinners
- [ ] Optimize bundle size

### Week 4: Testing & Monitoring
- [ ] Setup testing infrastructure
- [ ] Write unit tests for critical components
- [ ] Implement logging system
- [ ] Add error monitoring
- [ ] Create test coverage reports
- [ ] Setup CI/CD pipeline

---

## 🎯 **SUCCESS METRICS**

### Security
- [ ] No hardcoded credentials in code
- [ ] All environment variables properly configured
- [ ] JWT token management centralized
- [ ] XSS protection implemented

### Performance
- [ ] Bundle size reduced by >30%
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90

### Quality
- [ ] Test coverage > 80%
- [ ] Zero critical security vulnerabilities
- [ ] TypeScript strict mode enabled
- [ ] ESLint/Prettier configured

### Maintainability
- [ ] Consistent coding patterns
- [ ] Proper error handling throughout
- [ ] Documentation updated
- [ ] Environment-specific configurations

---

## 📞 **SUPPORT & RESOURCES**

### Documentation Links
- [React Performance Best Practices](https://react.dev/learn/render-and-commit)
- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Web Security Guidelines](https://owasp.org/www-project-top-ten/)

### Tools Needed
- Environment variable management
- Testing framework (Jest + RTL)
- Error monitoring (Sentry)
- Performance monitoring
- Code quality tools (ESLint, Prettier)

---

*Last Updated: 2025-01-23*
*Next Review: After Phase 1 completion*