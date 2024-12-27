import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RecipeCreateRequest } from '../../Models/RecipeCreateRequest';
import { notify } from '../../Utiles/notif';
import { RootState } from '../Redux/RootState';

const UpdateRecipe: React.FC = () => {
  const [recipeId, setRecipeId] = useState<number>(0);

  // Basic state for demonstration. Adapt to match your form fields.
  const [formData, setFormData] = useState<RecipeCreateRequest>({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    preparationSteps: '',
    cookingTime: 0,
    servings: 0,
    dietaryInfo: '',
    containsGluten: false,
  });

  const [error, setError] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean | number = value;

    if (type === 'number') {
      newValue = Number(value);
    }
    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleUpdate = async () => {
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

      await axios.put(`/api/recipes/${recipeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      notify.success('Recipe updated successfully!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      if (err.response && err.response.status === 404) {
        setError(`Recipe with ID ${recipeId} not found.`);
        notify.error(`Recipe with ID ${recipeId} not found.`);
      } else if (err.response && err.response.status === 403) {
        setError('You are not authorized to update this recipe.');
        notify.error('You are not authorized to update this recipe.');
      } else {
        setError(err?.response?.data || 'An unexpected error occurred while updating the recipe.');
        notify.error('An unexpected error occurred while updating the recipe.');
      }
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Update Recipe</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Recipe ID: </label>
        <input
          type="number"
          value={recipeId}
          onChange={(e) => setRecipeId(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Title: </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Description: </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* For brevity, just showing how you might handle a single ingredient */}
      <div>
        <label>Ingredient Name: </label>
        <input
          type="text"
          value={formData.ingredients[0]?.name}
          onChange={(e) => {
            const updatedIngredients = [...formData.ingredients];
            updatedIngredients[0] = {
              ...updatedIngredients[0],
              name: e.target.value,
            };
            setFormData({ ...formData, ingredients: updatedIngredients });
          }}
        />
      </div>

      <div>
        <label>Preparation Steps: </label>
        <textarea
          name="preparationSteps"
          value={formData.preparationSteps}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Cooking Time (minutes): </label>
        <input
          type="number"
          name="cookingTime"
          value={formData.cookingTime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Servings: </label>
        <input
          type="number"
          name="servings"
          value={formData.servings}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Dietary Info: </label>
        <input
          type="text"
          name="dietaryInfo"
          value={formData.dietaryInfo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Contains Gluten: </label>
        <input
          type="checkbox"
          name="containsGluten"
          checked={formData.containsGluten}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleUpdate}>Update Recipe</button>
    </div>
  );
};

export default UpdateRecipe;
