import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../hooks";
import { checkData } from "../../Utiles/checkData";
import RecipeList from "./RecipeList";
import SearchAndFilters from "./SearchAndFilters";
import "./GetAllRecipes.css";

// Inline PaginationControls Component
const PaginationControls: React.FC<{
  pagination: { page: number; size: number; totalPages: number };
  nextPage?: () => void;
  prevPage?: () => void;
  loading: boolean;
}> = ({ pagination, nextPage, prevPage, loading }) => {
  const { page, totalPages } = pagination;

  return (
    <div className="pagination">
      <button
        onClick={prevPage}
        disabled={page === 0 || loading}
      >
        Previous
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={nextPage}
        disabled={page >= totalPages - 1 || loading}
      >
        Next
      </button>
    </div>
  );
};

const GetAllRecipes: React.FC = () => {
  const navigate = useNavigate();
  
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
    filterCategory,
    setFilterCategory,
    nextPage,
    prevPage,
    canEdit,
  } = useRecipes();

  // Check authentication on mount
  useEffect(() => {
    checkData();
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    
    // Category filter logic - find the category name by ID and check if recipe categories include it
    const matchesCategory = !filterCategory || (() => {
      const selectedCategory = categories.find(cat => cat.id === parseInt(filterCategory));
      return selectedCategory && recipe.categories?.some(cat => 
        cat.toLowerCase() === selectedCategory.name.toLowerCase()
      );
    })();
    
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
        // Assuming newer recipes have higher IDs
        return b.id - a.id;
    }
  });


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="get-all-recipes">
      <div className="recipes-header">
        <h1>All Recipes</h1>
        <button 
          onClick={() => navigate('/create-recipe')}
          className="create-recipe-btn"
        >
          Create New Recipe
        </button>
      </div>

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

      <RecipeList
        recipes={sortedRecipes}
        onEditRecipe={canEdit ? handleEditRecipe : undefined}
      />

      {sortedRecipes.length === 0 && !loading && (
        <div className="no-recipes-found">
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filters, or create a new recipe!</p>
          <button 
            onClick={() => navigate('/create-recipe')}
            className="create-recipe-btn"
          >
            Create First Recipe
          </button>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          nextPage={nextPage}
          prevPage={prevPage}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GetAllRecipes;