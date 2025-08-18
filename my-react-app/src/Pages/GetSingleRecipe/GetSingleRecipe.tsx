import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";
// Using global design system instead of component-specific CSS

const GetSingleRecipe: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        if (!recipeId) {
          setError("Invalid recipe ID.");
          return;
        }

        const response = await RecipeService.getRecipeById(Number(recipeId));
        setRecipe(response.data);
      } catch (err: unknown) {
        let errorMessage = "Failed to load the recipe.";
        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        notify.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--background-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ 
            margin: '0 auto var(--spacing-lg) auto',
            width: '32px',
            height: '32px'
          }}></div>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Loading recipe...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div style={{
          backgroundColor: 'var(--danger-light)',
          border: '1px solid var(--danger-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{ 
            color: 'var(--danger-color)',
            fontSize: '1rem',
            fontWeight: 'var(--font-weight-medium)',
            margin: 0
          }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Recipe not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background-primary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
        {/* Back Button */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={() => navigate("/all/recipes")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: 'var(--spacing-xs) 0',
              transition: 'color var(--transition-normal)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
            Back to recipes
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 400px',
          gap: 'var(--spacing-2xl)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Main Content */}
          <div>
            {/* Recipe Header */}
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-md)',
                fontFamily: 'var(--font-heading)',
                lineHeight: '1.2'
              }}>
                {recipe.title}
              </h1>
              
              {recipe.description && (
                <p style={{
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {recipe.description}
                </p>
              )}
            </div>

            {/* Recipe Image */}
            {recipe.photo && (
              <div style={{
                marginBottom: 'var(--spacing-2xl)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)'
              }}>
                <img
                  src={`data:image/png;base64,${recipe.photo}`}
                  alt={recipe.title}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}

            {/* Ingredients Section */}
            <div style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              marginBottom: 'var(--spacing-xl)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-lg)',
                fontFamily: 'var(--font-heading)'
              }}>
                Ingredients
              </h2>
              
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-sm) 0',
                      borderBottom: index < recipe.ingredients!.length - 1 ? '1px solid var(--border-light)' : 'none'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'var(--text-muted)',
                        borderRadius: '50%',
                        flexShrink: 0
                      }}></div>
                      <span style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem'
                      }}>
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No ingredients listed.</p>
              )}
            </div>

            {/* Preparation Steps */}
            <div style={{
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-lg)',
                fontFamily: 'var(--font-heading)'
              }}>
                Preparation Steps
              </h2>
              
              <div style={{
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {recipe.preparationSteps || "No preparation steps provided."}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Recipe Info Card */}
            <div style={{
              backgroundColor: 'var(--background-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-xl)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: 'var(--spacing-lg)',
              position: 'sticky',
              top: 'var(--spacing-lg)'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-lg)',
                fontFamily: 'var(--font-heading)'
              }}>
                Recipe Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {/* Cooking Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--background-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cooking Time
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {recipe.cookingTime} minutes
                    </div>
                  </div>
                </div>

                {/* Servings */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--background-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Servings
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {recipe.servings}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {recipe.categories && recipe.categories.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                      Categories
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                      {recipe.categories.map((category, index) => (
                        <span key={index} style={{
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
                    </div>
                  </div>
                )}

                {/* Dietary Info */}
                {recipe.dietaryInfo && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                      Dietary Information
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {recipe.dietaryInfo}
                    </div>
                  </div>
                )}

                {/* Gluten Free Badge */}
                {!recipe.containsGluten && (
                  <div style={{
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--success-light)',
                    border: '1px solid var(--success-color)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--success-dark)',
                      fontWeight: 'var(--font-weight-medium)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Gluten Free
                    </span>
                  </div>
                )}

                {/* Author */}
                {recipe.createdByUsername && (
                  <div style={{ 
                    paddingTop: 'var(--spacing-md)', 
                    borderTop: '1px solid var(--border-light)',
                    marginTop: 'var(--spacing-md)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-xs)' }}>
                      Created by
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {recipe.createdByUsername}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Responsive Layout */}
        <style jsx>{`
          @media (max-width: 768px) {
            .container > div:last-child {
              grid-template-columns: 1fr !important;
              gap: var(--spacing-lg) !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GetSingleRecipe;
