import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RecipeService from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import { RecipeResponse } from '../../Models/RecipeResponse';
import { Category } from '../../Models/Category';
import RecipeSelector from './RecipeSelector';
import UpdateForm from './UpdateForm';

const UpdateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { requireAuth } = useAuth();
  
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!requireAuth()) return;
    
    loadCategories();
    if (id) {
      loadRecipeById(parseInt(id));
    }
  }, [id, requireAuth]);

  const loadCategories = async () => {
    try {
      const response = await RecipeService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
      notify.error('Failed to load categories');
    }
  };

  const loadRecipeById = async (recipeId: number) => {
    try {
      setIsLoading(true);
      const response = await RecipeService.getRecipeById(recipeId);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error('Error loading recipe:', error);
      notify.error('Recipe not found or you do not have permission to edit it');
      navigate('/my-recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeSelect = (recipe: RecipeResponse) => {
    setSelectedRecipe(recipe);
  };

  const handleUpdateSuccess = () => {
    setSuccessMessage('Recipe updated successfully! 🎉');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setSelectedRecipe(null);
  };

  if (isLoading) {
    return (
      <div className="update-recipe-container">
        <div className="update-recipe-card">
          <div className="update-recipe-content">
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
              <p>Loading recipe...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-recipe-container">
      <div className="update-recipe-card">
        <div className="update-recipe-header">
          <h1 className="update-recipe-title">Update Recipe</h1>
          <p className="update-recipe-subtitle">
            {selectedRecipe ? `Editing: ${selectedRecipe.title}` : 'Select a recipe to edit'}
          </p>
        </div>

        <div className="update-recipe-content">
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {!selectedRecipe && (
            <RecipeSelector onRecipeSelect={handleRecipeSelect} />
          )}

          {selectedRecipe && (
            <UpdateForm 
              recipe={selectedRecipe}
              categories={categories}
              onSuccess={handleUpdateSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateRecipe;