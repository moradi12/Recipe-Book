// src/Pages/GetAllRecipes/GetAllRecipes.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RecipeResponse } from '../../Models/Recipe';
import RecipeService, { PaginatedRecipes } from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';
import './GetAllRecipes.css'; // Import the CSS file

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string>('');

  // If you have JWT-based auth in Redux
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchRecipes = async (pageNumber: number, pageSize: number) => {
    try {
      setError('');
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }

      // NOTE: We call the "paginated" method now:
      const response = await RecipeService.getAllRecipesPaginated(pageNumber, pageSize);
      const data: PaginatedRecipes = response.data;

      setRecipes(data.content);
      setTotalPages(data.totalPages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching paginated recipes:', err);
      setError('An error occurred while retrieving recipes.');
      notify.error('An error occurred while retrieving recipes.');
    }
  };

  useEffect(() => {
    fetchRecipes(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  return (
    <div className="get-all-recipes">
      <h2>All Recipes (Page {page + 1} of {totalPages})</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Page size select */}
      <div className="controls">
        <label htmlFor="page-size">Page Size:</label>
        <select
          id="page-size"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (page < totalPages - 1) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Render the recipe list */}
      {recipes && recipes.length > 0 ? (
        <ul className="recipe-list">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="recipe-item">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              {/* ... display other fields as needed */}
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
