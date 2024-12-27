import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

const DeleteRecipe: React.FC = () => {
  const [recipeId, setRecipeId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = async () => {
    try {
      setError('');
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }
      if (!recipeId) {
        setError('Please enter a valid recipe ID.');
        return;
      }

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
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Delete Recipe</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Recipe ID: </label>
        <input
          type="number"
          value={recipeId}
          onChange={(e) => setRecipeId(Number(e.target.value))}
        />
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default DeleteRecipe;
