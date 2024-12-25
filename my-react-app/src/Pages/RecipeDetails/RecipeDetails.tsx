// src/Pages/RecipeDetails/RecipeDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RecipeResponse } from '../../Models/Recipe';
import { getRecipeById } from '../../Utiles/api/recipes';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('Recipe ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getRecipeById(Number(id));
        setRecipe(response);
        setError(null); // Clear error on success
      } catch (error: unknown) {
        console.error('Failed to fetch recipe', error);
        setError('Failed to load recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recipe) {
    return <p>No recipe found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
      <h2 className="text-xl mb-4">{recipe.title}</h2>
      <p className="mb-4">{recipe.description}</p>
      <div className="mb-4">
        <strong>Ingredients:</strong>
        <ul className="list-disc pl-6">
          {recipe.ingredients.map(ingredient => (
            <li key={ingredient.id}>
              {ingredient.name} - {ingredient.quantity}
            </li>
          ))}
        </ul>
      </div>
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
