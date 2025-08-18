import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes, useFavorites, useAuth } from "../../hooks";
import { checkData } from "../../Utiles/checkData";
import CategoryFilter from "./CategoryFilter";
// Using global design system instead of component-specific CSS
import PaginationControls from "./PaginationControls";
import RecipeList from "./RecipeList";
import SearchAndFilters from "./SearchAndFilters";

const GetAllRecipes: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuth();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("");
  
  const {
    recipes,
    categories,
    pagination,
    recipesLoading,
    categoriesLoading,
    fetchRecipes,
    fetchCategories,
    approveRecipe,
    rejectRecipe,
    deleteRecipe,
    updateRecipeStatus,
    filterCategory,
    setFilterCategory,
    nextPage,
    prevPage,
    goToPage,
    canEdit,
    canApprove,
    canDelete,
  } = useRecipes();

  // Check authentication on mount
  useEffect(() => {
    checkData();
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, [fetchCategories, fetchRecipes]);

  const handleEditRecipe = (recipeId: number) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  const loading = recipesLoading || categoriesLoading;

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = !searchTerm || 
                         recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesDietary = !dietaryFilter || 
                          (dietaryFilter === "gluten-free" && !recipe.containsGluten) ||
                          (dietaryFilter === "vegetarian" && recipe.dietaryInfo?.toLowerCase().includes("vegetarian"));
    
    const matchesTime = !timeFilter ||
                       (timeFilter === "quick" && recipe.cookingTime <= 30) ||
                       (timeFilter === "medium" && recipe.cookingTime > 30 && recipe.cookingTime <= 60) ||
                       (timeFilter === "long" && recipe.cookingTime > 60);
    
    // Category filter logic - check if the recipe's categories include the selected category name
    const matchesCategory = !filterCategory || 
                           recipe.categories.some(categoryName => {
                             const selectedCategory = categories.find(cat => String(cat.id) === filterCategory);
                             return selectedCategory && categoryName === selectedCategory.name;
                           });
    
    return matchesSearch && matchesDietary && matchesTime && matchesCategory;
  });

  // Sort filtered recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "cookingTime":
        return a.cookingTime - b.cookingTime;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  return (
    <div className="fade-in" style={{ minHeight: '100vh', backgroundColor: 'var(--background-primary)' }}>
      {/* Official Header Section */}
      <div style={{ 
        backgroundColor: 'var(--background-secondary)',
        borderBottom: '1px solid var(--border-light)',
        padding: 'var(--spacing-2xl) 0'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              fontFamily: 'var(--font-heading)'
            }}>
              Recipe Collection
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-xl)',
              lineHeight: '1.6'
            }}>
              Browse our comprehensive collection of professionally curated recipes
            </p>
            
            {/* Stats Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 'var(--spacing-2xl)', 
              flexWrap: 'wrap',
              marginTop: 'var(--spacing-lg)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {sortedRecipes.length}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {sortedRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
                </div>
              </div>
              
              {pagination.totalPages > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.875rem', 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {pagination.page + 1}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    of {pagination.totalPages} Pages
                  </div>
                </div>
              )}
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'var(--font-weight-bold)', 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {categories.length}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
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
              Loading recipes...
            </p>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
        {/* Search and Filters Section */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          dietaryFilter={dietaryFilter}
          setDietaryFilter={setDietaryFilter}
          categories={categories}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          disabled={loading}
          resultCount={sortedRecipes.length}
        />

        {/* Recipe List */}
        {!loading && (
          <RecipeList
            recipes={sortedRecipes}
            onEditRecipe={canEdit ? handleEditRecipe : undefined}
            onApproveRecipe={canApprove ? approveRecipe : undefined}
            onRejectRecipe={canApprove ? rejectRecipe : undefined}
            onDeleteRecipe={canDelete ? deleteRecipe : undefined}
          />
        )}

        {/* Pagination Controls */}
        {!loading && recipes.length > 0 && (
          <PaginationControls
            pagination={pagination}
            nextPage={nextPage}
            prevPage={prevPage}
            goToPage={goToPage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default GetAllRecipes;
