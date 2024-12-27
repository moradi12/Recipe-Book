import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RecipeResponse } from '../../Models/RecipeResponse';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

interface PaginatedRecipes {
  content: RecipeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchRecipes = async (pageNumber: number, pageSize: number) => {
    try {
      setError('');
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }

      const response = await axios.get<PaginatedRecipes>(
        `/api/recipes/all?page=${pageNumber}&size=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRecipes(response.data.content);
      setTotalPages(response.data.totalPages);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching all recipes:', err);
      setError('An error occurred while retrieving recipes.');
      notify.error('An error occurred while retrieving recipes.');
    }
  };

  useEffect(() => {
    fetchRecipes(page, size);
    // eslint-disable-next-line
  }, [page, size]);

  return (
    <div style={{ margin: '1rem' }}>
      <h2>All Recipes (page {page + 1})</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Page Size: </label>
        <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
        disabled={page >= totalPages - 1}
      >
        Next
      </button>

      <ul style={{ marginTop: '1rem' }}>
        {recipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: '1rem' }}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            {/* Display other recipe fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllRecipes;
