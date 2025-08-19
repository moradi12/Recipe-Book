import React, { useState } from 'react';
import { useAuth, useRecipes } from '../../hooks';
import { notify } from '../../Utiles/notif';

interface DeleteRecipeProps {
  recipeId: number;
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const DeleteRecipe: React.FC<DeleteRecipeProps> = ({ 
  recipeId, 
  onSuccess, 
  className = "delete-button",
  children = "Delete Recipe"
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { requireAuth } = useAuth();
  const { deleteRecipe } = useRecipes();

  const handleDeleteClick = () => {
    if (!requireAuth()) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);

    try {
      const success = await deleteRecipe(recipeId);
      if (success) {
        notify.success('Recipe deleted successfully!');
        onSuccess?.();
      } else {
        notify.error('Failed to delete recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      notify.error('Failed to delete recipe. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="delete-confirmation">
        <p>Are you sure you want to delete this recipe?</p>
        <div className="confirmation-buttons">
          <button 
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="confirm-delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button 
            onClick={handleCancelDelete}
            disabled={isDeleting}
            className="cancel-delete-button"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleDeleteClick} 
      disabled={isDeleting}
      className={className}
    >
      {isDeleting ? 'Deleting...' : children}
    </button>
  );
};

export default DeleteRecipe;
