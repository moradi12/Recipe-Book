// Pages/GetRecipeById/GetRecipeById.tsx
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RecipeResponse } from '../../Models/RecipeResponse'; // Ensure correct import
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

const GetRecipeById: React.FC = () => {
  const [recipeId, setRecipeId] = useState<number>(0);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleFetch = async () => {
    try {
      setError('');
      setRecipe(null);

      if (!recipeId) {
        setError('Please enter a valid recipe ID.');
        return;
      }
      if (!token) {
        setError('Authentication token is missing. Please log in.');
        return;
      }

      const response = await axios.get<RecipeResponse>(`/api/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRecipe(response.data);
      notify.success('Recipe fetched successfully!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
      if (err.response && err.response.status === 404) {
        setError(`Recipe with ID ${recipeId} not found.`);
        notify.error(`Recipe with ID ${recipeId} not found.`);
      } else {
        setError(err?.response?.data || 'An error occurred while fetching the recipe.');
        notify.error('An error occurred while fetching the recipe.');
      }
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Get Recipe By ID</h2>
      <div>
        <label>Recipe ID: </label>
        <input 
          type="number"
          value={recipeId}
          onChange={(e) => setRecipeId(Number(e.target.value))}
        />
        <button onClick={handleFetch}>Fetch Recipe</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recipe && (
        <div style={{ border: '1px solid #ccc', marginTop: '1rem', padding: '1rem' }}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <p>Cooking time: {recipe.cookingTime} minutes</p>
          <p>Servings: {recipe.servings}</p>
          {/* Add more fields as needed */}
          <h4>Categories:</h4>
          <ul>
            {recipe.categories && recipe.categories.length > 0 ? (
              recipe.categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))
            ) : (
              <li>No categories available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetRecipeById;
