import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import RecipeService from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import { RecipeResponse } from '../../Models/RecipeResponse';
import { Category } from '../../Models/Category';
import IngredientsSection from '../AddRecipe/IngredientsSection';

interface UpdateFormData {
  title: string;
  description: string;
  instructions: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  categoryIds: number[];
  ingredients: Array<{
    id: string;
    name: string;
    quantity: string;
    unit: string;
  }>;
}

interface UpdateFormProps {
  recipe: RecipeResponse;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ recipe, categories, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<UpdateFormData>({
    mode: "onChange",
    defaultValues: {
      title: recipe.title,
      description: recipe.description || '',
      instructions: recipe.instructions || '',
      preparationTime: recipe.preparationTime || 0,
      cookingTime: recipe.cookingTime || 0,
      servings: recipe.servings || 1,
      categoryIds: recipe.categories ? [recipe.categories[0]?.id] : [],
      ingredients: recipe.ingredients?.map((ing, index) => ({
        id: (index + 1).toString(),
        name: typeof ing === 'string' ? ing : ing.name || '',
        quantity: typeof ing === 'string' ? '' : ing.quantity || '',
        unit: typeof ing === 'string' ? '' : ing.unit || '',
      })) || [{ id: '1', name: '', quantity: '', unit: '' }]
    }
  });

  const ingredients = watch("ingredients") || [];

  const addIngredient = () => {
    const newIngredient = {
      id: (ingredients.length + 1).toString(),
      name: '',
      quantity: '',
      unit: ''
    };
    setValue("ingredients", [...ingredients, newIngredient]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setValue("ingredients", newIngredients);
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setValue("ingredients", newIngredients);
  };

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const updateData = {
        ...data,
        categoryIds: data.categoryIds.length > 0 ? data.categoryIds : [1],
      };

      await RecipeService.updateRecipe(recipe.id, updateData);
      notify.success('Recipe updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating recipe:', error);
      notify.error('Failed to update recipe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>
        
        <div className="form-group">
          <label className="form-label" htmlFor="title">Recipe Title*</label>
          <input
            id="title"
            type="text"
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter recipe title"
            {...register("title", {
              required: "Recipe title is required",
              minLength: { value: 3, message: "Title must be at least 3 characters" }
            })}
          />
          {errors.title && (
            <div className="error-message">{errors.title.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description*</label>
          <textarea
            id="description"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Describe your recipe"
            rows={3}
            {...register("description", {
              required: "Recipe description is required"
            })}
          />
          {errors.description && (
            <div className="error-message">{errors.description.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="categoryIds">Category</label>
          <select
            id="categoryIds"
            className="form-input"
            {...register("categoryIds.0", {
              valueAsNumber: true
            })}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Recipe Details</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="preparationTime">Prep Time (min)*</label>
            <input
              id="preparationTime"
              type="number"
              min="1"
              className={`form-input ${errors.preparationTime ? 'error' : ''}`}
              {...register("preparationTime", {
                required: "Preparation time is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1 minute" }
              })}
            />
            {errors.preparationTime && (
              <div className="error-message">{errors.preparationTime.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cookingTime">Cook Time (min)*</label>
            <input
              id="cookingTime"
              type="number"
              min="1"
              className={`form-input ${errors.cookingTime ? 'error' : ''}`}
              {...register("cookingTime", {
                required: "Cooking time is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be at least 1 minute" }
              })}
            />
            {errors.cookingTime && (
              <div className="error-message">{errors.cookingTime.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="servings">Servings*</label>
            <input
              id="servings"
              type="number"
              min="1"
              className={`form-input ${errors.servings ? 'error' : ''}`}
              {...register("servings", {
                required: "Servings is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must serve at least 1 person" }
              })}
            />
            {errors.servings && (
              <div className="error-message">{errors.servings.message}</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Ingredients</h3>
        <IngredientsSection
          ingredients={ingredients}
          onIngredientChange={handleIngredientChange}
          onRemoveIngredient={removeIngredient}
          onAddIngredient={addIngredient}
          error={errors.ingredients?.message}
        />
      </div>

      <div className="form-section">
        <h3 className="section-title">Instructions</h3>
        <div className="form-group">
          <label className="form-label" htmlFor="instructions">Cooking Instructions*</label>
          <textarea
            id="instructions"
            className={`form-textarea ${errors.instructions ? 'error' : ''}`}
            placeholder="Step-by-step cooking instructions"
            rows={6}
            {...register("instructions", {
              required: "Cooking instructions are required"
            })}
          />
          {errors.instructions && (
            <div className="error-message">{errors.instructions.message}</div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner" />
              Updating Recipe...
            </>
          ) : (
            'Update Recipe'
          )}
        </button>
        
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate('/my-recipes')}
        >
          Cancel
        </button>
        
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
        >
          Select Different Recipe
        </button>
      </div>
    </form>
  );
};

export default UpdateForm;