import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

const DeleteRecipe: React.FC = () => {
  const [recipeId, setRecipeId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = async () => {
    try {
      setError('');
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }
      if (!recipeId || recipeId <= 0) {
        setError('Please enter a valid recipe ID greater than 0.');
        return;
      }

      setLoading(true);

      await axios.delete(`/api/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      notify.success('Recipe deleted successfully!');
      setRecipeId(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      if (err.response && err.response.status === 404) {
        setError(`Recipe with ID ${recipeId} not found.`);
        notify.error(`Recipe with ID ${recipeId} not found.`);
      } else if (err.response && err.response.status === 403) {
        setError('You are not authorized to delete this recipe.');
        notify.error('You are not authorized to delete this recipe.');
      } else {
        setError(err?.response?.data || 'An unexpected error occurred while deleting the recipe.');
        notify.error('An unexpected error occurred while deleting the recipe.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Delete Recipe</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
        <label htmlFor="recipeId" style={{ fontWeight: 'bold' }}>Recipe ID:</label>
        <input
          id="recipeId"
          type="number"
          value={recipeId}
          onChange={(e) => setRecipeId(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
          min="1"
        />
        <button
          onClick={handleDelete}
          style={{
            padding: '0.5rem',
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteRecipe;
