import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../Models/Category';
import { RecipeResponse } from '../../Models/Recipe';
import RecipeService, { PaginatedRecipes } from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import './GetAllRecipes.css';

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await RecipeService.getAllRecipesPaginated(
        pagination.page,
        pagination.size,
        filterCategory
      );
      const data: PaginatedRecipes = response.data;
      setRecipes(data.content);
      setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load recipes.';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [pagination.page, pagination.size, filterCategory]);

  return (
    <div className="get-all-recipes">
      <h2>
        All Recipes {pagination.totalPages > 0 && `(Page ${pagination.page + 1} of ${pagination.totalPages})`}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <h3>{recipe.title || 'No Title'}</h3>
            <p><strong>Description:</strong> {recipe.description || 'No Description'}</p>
            <p><strong>Preparation Steps:</strong> {recipe.preparationSteps || 'None'}</p>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Dietary Info:</strong> {recipe.dietaryInfo || 'N/A'}</p>
            <p><strong>Contains Gluten:</strong> {recipe.containsGluten ? 'Yes' : 'No'}</p>
            <p><strong>Status:</strong> {recipe.status || 'Unknown'}</p>
            <h4>Ingredients:</h4>
            {recipe.ingredients?.length ? (
              <ul>
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed</p>
            )}
            <button onClick={() => navigate(`/edit-recipe/${recipe.id}`)}>Edit</button>
            <button onClick={() => notify.success(`Deleted recipe ${recipe.title || recipe.id}`)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))} disabled={pagination.page === 0}>
          Previous
        </button>
        <span>
          Page {pagination.page + 1} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          disabled={pagination.page >= pagination.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetAllRecipes;
