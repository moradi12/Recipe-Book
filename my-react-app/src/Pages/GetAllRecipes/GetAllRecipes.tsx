import React, { useEffect, useState } from 'react';
import { Category } from '../../Models/Category';
import { RecipeResponse } from '../../Models/Recipe';
import RecipeService, { PaginatedRecipes } from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import './GetAllRecipes.css';

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await RecipeService.getAllCategories();
      console.log('Fetched Categories:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      notify.error('Could not retrieve categories.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async (pageNumber: number, pageSize: number, category?: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await RecipeService.getAllRecipesPaginated(pageNumber, pageSize, category);
      const data: PaginatedRecipes = response.data;
      console.log('Fetched Recipes:', data.content);
      setRecipes(data.content);
      setTotalPages(data.totalPages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching paginated recipes:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred while retrieving recipes.';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFilterCategory(selectedCategory);
    setPage(0);
  };

  useEffect(() => {
    fetchRecipes(page, size, filterCategory);
  }, [page, size, filterCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="get-all-recipes">
      <h2>All Recipes {totalPages > 0 && `(Page ${page + 1} of ${totalPages})`}</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select id="category-filter" value={filterCategory} onChange={handleCategoryFilter}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="controls">
        <label htmlFor="page-size">Page Size:</label>
        <select
          id="page-size"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          Previous
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <input
          type="number"
          min="1"
          max={totalPages || 1}
          value={page + 1}
          onChange={(e) => {
            const inputPage = Number(e.target.value);
            if (!isNaN(inputPage)) {
              const newPage = Math.max(0, Math.min(inputPage - 1, totalPages - 1));
              setPage(newPage);
            }
          }}
        />
        <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page >= totalPages - 1}>
          Next
        </button>
      </div>

      {recipes.length > 0 ? (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              <h3>{recipe.title || 'No Title'}</h3>
              <p>
                <strong>Name:</strong> {recipe.name || 'No Name'}
              </p>
              <p>
                <strong>Description:</strong> {recipe.description || 'No Description'}
              </p>
              <p>
                <strong>Preparation Steps:</strong> {recipe.preparationSteps || 'No Preparation Steps'}
              </p>
              <p>
                <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
              </p>
              <p>
                <strong>Servings:</strong> {recipe.servings}
              </p>
              <p>
                <strong>Dietary Info:</strong> {recipe.dietaryInfo || 'N/A'}
              </p>
              <p>
                <strong>Contains Gluten:</strong> {recipe.containsGluten ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Status:</strong> {recipe.status || 'Unknown'}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(recipe.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(recipe.updatedAt).toLocaleString()}
              </p>

              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients?.length > 0 ? (
                  recipe.ingredients.map((ingredient) => (
                    <li>
                      {ingredient}
                    </li>
                  ))
                ) : (
                  <p>No ingredients listed</p>
                )}
              </ul>

              <h4>Categories:</h4>
              <ul>
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>{category.name || 'Unnamed'}</li>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="no-recipes">No recipes found.</p>
      )}
    </div>
  );
};

export default GetAllRecipes;
