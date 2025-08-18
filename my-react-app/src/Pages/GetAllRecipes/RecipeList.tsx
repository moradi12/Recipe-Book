import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
// Using global design system instead of component-specific CSS

import { notify } from "../../Utiles/notif";
import recipeSystem from "../Redux/store";
import { useFavorites } from "../../hooks/useFavorites";

interface RecipeListProps {
  recipes: RecipeResponse[];
  onEditRecipe?: (id: number) => void;
  onApproveRecipe?: (id: number) => void;
  onRejectRecipe?: (id: number) => void;
  onDeleteRecipe?: (id: number) => Promise<void>;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onEditRecipe,
  onApproveRecipe,
  onRejectRecipe,
  onDeleteRecipe,
}) => {
  const navigate = useNavigate();
  const token = recipeSystem.getState().auth.token;

  // Use the new favorites hook
  const { favoriteRecipeIds, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [expandedAdminActions, setExpandedAdminActions] = useState<Set<number>>(new Set());

  // Toggle admin actions visibility for a specific recipe
  const toggleAdminActions = (recipeId: number) => {
    setExpandedAdminActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  // Handle approve recipe and hide admin actions
  const handleApproveRecipe = (recipeId: number) => {
    if (onApproveRecipe) {
      onApproveRecipe(recipeId);
      // Hide admin actions after approval
      setExpandedAdminActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    }
  };

  // Note: Favorites are now handled by the useFavorites hook

  const handleToggleFavorite = async (recipeId: number) => {
    // Use the useFavorites hook for consistent favorite handling
    await toggleFavorite(recipeId);
  };

  if (!recipes.length) {
    return (
      <div className="text-center p-4" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="fade-in">
          <svg className="text-muted" style={{ width: '64px', height: '64px', margin: '0 auto var(--spacing-md) auto' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h3 className="text-primary mb-2">No recipes found</h3>
          <p className="text-secondary">Try adjusting your search criteria or filters to find more recipes.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-xl)'
    }}>
      {recipes.map((recipe) => {
        // Check if this recipe is currently favorited
        const isFav = favoriteRecipeIds.includes(recipe.id);
        
        // Check if admin actions should be expanded for this recipe
        const isExpanded = expandedAdminActions.has(recipe.id);
        const isApproved = recipe.status === "approved" || recipe.status === "APPROVED";

        return (
          <div key={recipe.id} style={{
            backgroundColor: 'var(--background-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            {/* Status Badge */}
            {recipe.status && recipe.status !== "approved" && (
              <div style={{ 
                position: 'absolute', 
                top: 'var(--spacing-md)', 
                right: 'var(--spacing-md)', 
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: '0.75rem',
                textTransform: 'capitalize',
                backgroundColor: 'var(--warning-color)',
                color: 'var(--text-light)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'var(--font-weight-medium)',
                zIndex: 10
              }}>
                {recipe.status}
              </div>
            )}
            
            {/* Recipe Image */}
            {recipe.photo && (
              <div style={{ 
                position: 'relative', 
                overflow: 'hidden',
                height: '200px',
                backgroundColor: 'var(--background-tertiary)'
              }}>
                <img
                  src={`data:image/png;base64,${recipe.photo}`}
                  alt={recipe.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            
            {/* Content container */}
            <div style={{ 
              padding: 'var(--spacing-lg)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)',
                lineHeight: '1.3',
                margin: '0 0 var(--spacing-sm) 0'
              }}>
                {recipe.title || "No Title"}
              </h3>
              
              {recipe.description && (
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--spacing-md)',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4',
                  margin: '0 0 var(--spacing-md) 0'
                }}>
                  {recipe.description}
                </p>
              )}
              
              {/* Recipe Meta Information */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 'var(--spacing-lg)',
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-md)',
                fontSize: '0.875rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  <span>{recipe.cookingTime} min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                  <span>{recipe.servings} servings</span>
                </div>
                {recipe.createdByUsername && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>By {recipe.createdByUsername}</span>
                  </div>
                )}
              </div>
              
              {/* Categories */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 'var(--spacing-xs)', 
                marginBottom: 'var(--spacing-lg)',
                marginTop: 'auto'
              }}>
                {recipe.categories && recipe.categories.map((category, idx) => (
                  <span key={idx} style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    {category}
                  </span>
                ))}
                {recipe.dietaryInfo && (
                  <span style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    {recipe.dietaryInfo}
                  </span>
                )}
                {recipe.containsGluten === false && (
                  <span style={{
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    backgroundColor: 'var(--background-tertiary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    Gluten-Free
                  </span>
                )}
              </div>
            </div>

            {/* Buttons container */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              padding: 'var(--spacing-lg)', 
              paddingTop: 'var(--spacing-md)',
              borderTop: '1px solid var(--border-light)',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <button
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--text-light)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Recipe
              </button>

              {token && (
                <button
                  className={`button button-favorite ${isFav ? 'favorited' : ''}`}
                  onClick={() => handleToggleFavorite(recipe.id)}
                  disabled={favoritesLoading}
                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                >
                  {favoritesLoading ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12l2 2 4-4"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  )}
                  {favoritesLoading ? 'Updating...' : (isFav ? 'Favorited' : 'Add to Favorites')}
                </button>
              )}

              {onEditRecipe && (
                <button
                  onClick={() => {
                    onEditRecipe(recipe.id);
                    navigate(`/edit-recipe/${recipe.id}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}

              {/* Admin Actions Toggle Button */}
              {(onApproveRecipe || onRejectRecipe || onDeleteRecipe) && (
                <>
                  {/* Show More/Less button for admin actions */}
                  {!isExpanded ? (
                    <button
                      onClick={() => toggleAdminActions(recipe.id)}
                      className="admin-toggle-button"
                      title={isApproved ? "Show admin actions (recipe is approved)" : "Show admin actions"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3"/>
                        <circle cx="12" cy="5" r="3"/>
                        <circle cx="12" cy="19" r="3"/>
                      </svg>
                      {isApproved ? 'Admin' : 'More'}
                    </button>
                  ) : (
                    <>
                      {/* Show Less button */}
                      <button
                        onClick={() => toggleAdminActions(recipe.id)}
                        className="admin-toggle-button expanded"
                        title="Hide admin actions"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="18,15 12,9 6,15"/>
                        </svg>
                        Less
                      </button>

                      {/* Admin Action Buttons */}
                      {onApproveRecipe && (
                        <button
                          onClick={() => handleApproveRecipe(recipe.id)}
                          className={`button ${isApproved ? 'button-secondary' : 'button-success'}`}
                          title={isApproved ? "Recipe is already approved" : "Approve recipe"}
                          disabled={isApproved}
                          style={isApproved ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                          {isApproved ? 'Approved' : 'Approve'}
                        </button>
                      )}

                      {onRejectRecipe && (
                        <button
                          onClick={() => onRejectRecipe(recipe.id)}
                          className="button button-warning"
                          title="Reject recipe"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                          Reject
                        </button>
                      )}

                      {onDeleteRecipe && (
                        <button
                          onClick={() => onDeleteRecipe(recipe.id)}
                          className="button button-danger"
                          title="Delete recipe"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;
