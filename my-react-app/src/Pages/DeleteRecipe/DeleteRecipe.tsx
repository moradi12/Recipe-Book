import React from 'react';
import RecipeService from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';

interface DeleteRecipeProps {
  recipeId: number;
  token: string;
  onSuccess: () => void;
}

const DeleteRecipe: React.FC<DeleteRecipeProps> = ({ recipeId, token, onSuccess }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await RecipeService.deleteRecipe(recipeId, token);
        notify.success('Recipe deleted successfully!');
        onSuccess();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        notify.error('Failed to delete recipe. Please try again later.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="delete-button">
      Delete Recipe
    </button>
  );
};

export default DeleteRecipe;
