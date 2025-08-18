/**
 * @deprecated Use the new useFavorites hook from '../../hooks/useFavorites' instead
 */
import { useFavorites as useNewFavorites } from '../../../hooks/useFavorites';

// Re-export the new hook for backward compatibility
export function useFavorites() {
  console.warn('Using deprecated useFavorites hook. Please import from hooks/useFavorites instead.');
  return useNewFavorites();
}
