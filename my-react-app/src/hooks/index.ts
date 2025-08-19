// Custom Hooks - Centralized exports
export { useApi } from './useApi';
export { useAuth } from './useAuth';
export { useRecipes } from './useRecipes';
export { useFavorites } from './useFavorites';
export { useUser } from './useUser';
export { useForm, validators } from './useForm';
export { useAdmin } from './useAdmin';
export { useRecipeForm } from './useRecipeForm';

// Re-export types for convenience
export type { ApiHookReturn, ApiState } from './useApi';
export type { AuthHookReturn } from './useAuth';
export type { RecipesHookReturn, PaginationState } from './useRecipes';
export type { FavoritesHookReturn } from './useFavorites';
export type { UserHookReturn } from './useUser';
export type { UseFormReturn, FormConfig } from './useForm';
export type { AdminHookReturn } from './useAdmin';