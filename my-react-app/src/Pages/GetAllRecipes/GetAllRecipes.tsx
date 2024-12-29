import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Category } from '../../Models/Category';
import { RecipeResponse } from '../../Models/Recipe';
import RecipeService, { PaginatedRecipes } from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import './GetAllRecipes.css';

const GetAllRecipes: React.FC = () => {
  // State variables
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch categories from the public endpoint
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await RecipeService.getAllCategories(); // Calls /api/recipes/categories
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      notify.error('Could not retrieve categories.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch paginated recipes, optionally filtered by category
  const fetchRecipes = async (pageNumber: number, pageSize: number, category?: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await RecipeService.getAllRecipesPaginated(pageNumber, pageSize, category);
      const data: PaginatedRecipes = response.data;

      setRecipes(data.content);
      setTotalPages(data.totalPages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching paginated recipes:', err);
      const errorMessage =
        err.response?.data?.message || 'An error occurred while retrieving recipes.';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter change
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setFilterCategory(selectedCategory);
    setPage(0); // Reset to first page when filter changes
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    setPage(0); // Reset to first page when size changes
  };

  // Handle direct page number input
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPage = Number(e.target.value);
    if (!isNaN(inputPage)) {
      const newPage = Math.max(0, Math.min(inputPage - 1, totalPages - 1));
      setPage(newPage);
    }
  };

  // Handle navigation to previous page
  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  // Handle navigation to next page
  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // Handle delete functionality
  const handleDelete = async (id: number) => {
    try {
      await RecipeService.deleteRecipe(id, '<YOUR_AUTH_TOKEN>'); // Replace with a valid token
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      notify.success('Recipe deleted successfully.');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      notify.error('Failed to delete the recipe.');
    }
  };

  // Handle edit functionality
  const handleEdit = (id: number) => {
    navigate(`/edit-recipe/${id}`); // Redirect to edit form
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch recipes whenever page, size, or filterCategory changes
  useEffect(() => {
    fetchRecipes(page, size, filterCategory);
  }, [page, size, filterCategory]);

  return (
    <div className="get-all-recipes">
      <h2>
        All Recipes {totalPages > 0 && `(Page ${page + 1} of ${totalPages})`}
      </h2>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Category Filter */}
      <div className="filter-container">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={handleCategoryFilter}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Page Size Selector */}
      <div className="controls">
        <label htmlFor="page-size">Page Size:</label>
        <select id="page-size" value={size} onChange={handlePageSizeChange}>
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>
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
          onChange={handlePageInputChange}
          className="page-input"
        />
        <button onClick={handleNextPage} disabled={page >= totalPages - 1}>
          Next
        </button>
      </div>

      {/* Recipe List */}
      {recipes.length > 0 ? (
  <ul className="recipe-list">
    {recipes.map((recipe) => (
      <li key={recipe.id} className="recipe-item">
        <h3>{recipe.title || 'No Title'}</h3>
        <p>
          <strong>Description:</strong> {recipe.description || 'No Description'}
        </p>
        <p>
          <strong>Preparation Steps:</strong>{' '}
          {recipe.preparationSteps || 'No Preparation Steps'}
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
          <strong>Created At:</strong>{' '}
          {new Date(recipe.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{' '}
          {new Date(recipe.updatedAt).toLocaleString()}
        </p>

        {/* Ingredients */}
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

        {/* Buttons for editing and deleting */}
        <button
          onClick={() => handleEdit(recipe.id)}
          className="edit-button"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(recipe.id)}
          className="delete-button"
        >
          Delete
        </button>
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
