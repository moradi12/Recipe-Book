import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { useRecipes } from '../../hooks';
import { RecipeResponse } from '../../Models/RecipeResponse';
// Using global design system instead of component-specific CSS

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const { fetchRecipes, recipes, recipesLoading } = useRecipes();
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeResponse[]>([]);

  // Fetch featured recipes on component mount
  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      await fetchRecipes(0, 8); // Fetch first 8 recipes to have more options
    };
    loadFeaturedRecipes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update featured recipes when recipes change
  useEffect(() => {
    if (recipes.length > 0) {
      setFeaturedRecipes(recipes.slice(0, 6)); // Take first 6 recipes
    }
  }, [recipes]);

  return (
    <div className="fade-in">
      {/* Professional Hero Section */}
      <section style={{
        backgroundColor: 'var(--background-primary)',
        padding: 'var(--spacing-3xl) 0',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            textAlign: 'center' 
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-lg)',
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.2'
            }}>
              Professional Recipe Management
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-2xl)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto var(--spacing-2xl) auto'
            }}>
              Streamline your culinary workflow with our comprehensive recipe management platform
            </p>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => navigate('/all/recipes')}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-xl)',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--text-light)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                }}
              >
                View Collection
              </button>
              {!isLogged && (
                <button 
                  onClick={() => navigate('/register')}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-xl)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section style={{
        backgroundColor: 'var(--background-secondary)',
        padding: 'var(--spacing-2xl) 0',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-heading)'
            }}>
              Featured Recipes
            </h2>
            <button
              onClick={() => navigate('/all/recipes')}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color var(--transition-normal)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              View all recipes →
            </button>
          </div>

          {recipesLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <div className="loading-spinner" style={{ 
                width: '32px',
                height: '32px'
              }}></div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-lg)',
              maxWidth: '1200px'
            }}>
              {featuredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  style={{
                    backgroundColor: 'var(--background-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Recipe Image */}
                  {recipe.photo && (
                    <div style={{
                      height: '160px',
                      backgroundColor: 'var(--background-tertiary)',
                      overflow: 'hidden'
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
                  
                  {/* Recipe Content */}
                  <div style={{ padding: 'var(--spacing-lg)' }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)',
                      lineHeight: '1.3',
                      margin: '0 0 var(--spacing-sm) 0'
                    }}>
                      {recipe.title}
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
                    
                    {/* Recipe Meta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12,6 12,12 16,14"/>
                        </svg>
                        {recipe.cookingTime} min
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                        {recipe.servings} servings
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!recipesLoading && featuredRecipes.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-2xl)',
              color: 'var(--text-muted)'
            }}>
              <p>No recipes available at the moment.</p>
            </div>
          )}
        </div>
      </section>


      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4 font-heading" style={{ fontSize: '2.5rem', fontWeight: 'var(--font-weight-bold)' }}>
            Why Choose Recipe Hub?
          </h2>
          <div className="grid grid-2">
            <div className="card text-center slide-up">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
                <h3 className="text-primary mb-2">Easy Search</h3>
                <p className="text-secondary">Find recipes by ingredients, cuisine, or cooking time</p>
              </div>
            </div>
            <div className="card text-center slide-up">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>💝</div>
                <h3 className="text-primary mb-2">Save Favorites</h3>
                <p className="text-secondary">Keep your loved recipes in your personal collection</p>
              </div>
            </div>
            <div className="card text-center slide-up">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📱</div>
                <h3 className="text-primary mb-2">Mobile Ready</h3>
                <p className="text-secondary">Cook anywhere with our mobile-friendly design</p>
              </div>
            </div>
            <div className="card text-center slide-up">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>👥</div>
                <h3 className="text-primary mb-2">Community</h3>
                <p className="text-secondary">Share your recipes and connect with food lovers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Cooking?</h2>
            <p>Join our community and discover your next favorite recipe</p>
            <div className="cta-buttons">
              {!isLogged ? (
                <>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => navigate('/all/recipes')}
                  >
                    Explore Recipes
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/create')}
                  >
                    Share a Recipe
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => navigate('/userpanel')}
                  >
                    My Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;