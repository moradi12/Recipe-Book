// src/Pages/RecipeDetails/RecipeDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecipeResponse } from '../../Models/Recipe';
import { getRecipeById } from '../../Utiles/api/recipes';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null); // Optional: Handle errors

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const response = await getRecipeById(Number(id));
          setRecipe(response);
        } catch (error: unknown) {
          console.error('Failed to fetch recipe', error);
          setError('Failed to load recipe.');
        }
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
      <h2 className="text-xl mb-4">{recipe.title}</h2>
      <p className="mb-4">{recipe.description}</p>
      <p className="mb-2"><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
      <p className="mb-2"><strong>Cooking Time:</strong> {recipe.cookingTime} mins</p>
      <p className="mb-2"><strong>Servings:</strong> {recipe.servings}</p>
      <p className="mb-2"><strong>Dietary Info:</strong> {recipe.dietaryInfo || 'N/A'}</p>
      <p className="mb-2"><strong>Created By:</strong> {recipe.createdBy.username}</p>
      <p className="mb-2"><strong>Status:</strong> {recipe.status}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default RecipeDetails;
