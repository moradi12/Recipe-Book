import React, { useCallback, useMemo, useState } from 'react';
import { FoodCategory } from '../../Models/FoodCategory';
import useRecipeForm from '../Redux/Hooks/useRecipeForm';
import './CreateRecipe.css';
import IngredientItem from './IngredientItem';

const CreateRecipe: React.FC = () => {
  const {
    form,
    setForm,
    errors,
    isSubmitting,
    handleChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleSubmit,
  } = useRecipeForm();

  /** 
   * We store only category in local state. 
   * If you want to unify it with the form state, 
   * you could add it to your form (like `form.category`).
   */
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  /** Convert your category enum to array only once (memoized). */
  const foodCategoryOptions = useMemo(() => Object.values(FoodCategory), []);

  /** Handler for <select> category changes. */
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    },
    []
  );

  /** Handler for photo upload. */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Example: "data:image/png;base64,iVBORw0K..."
        const result = reader.result;
        // Let's separate the base64 data from the prefix:
        const base64Data = result.split(',')[1]; 
        
        // This sets only the actual base64 in your form
        setForm((prev) => ({
          ...prev,
          photo: base64Data,
        }));
  
        // Meanwhile, keep the full data URL for client-side preview
        setPhotoPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };
  

  /** Helper to render all error messages if present. */
  const renderErrorMessages = useCallback(() => {
    if (Object.keys(errors).length === 0) return null;
    return (
      <div className="error-messages">
        <ul>
          {Object.values(errors).map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }, [errors]);

  return (
    <div className="create-recipe-container">
      <h2>Create a New Recipe</h2>

      {renderErrorMessages()}

      {/* Pass the selectedCategory to handleSubmit. 
          Alternatively, store category inside form state. */}
      <form onSubmit={(e) => handleSubmit(e, selectedCategory)}>
        {/* ===== Title ===== */}
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* ===== Description ===== */}
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            value={form.description}
            onChange={handleChange}
            required
          />
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>

        {/* ===== Ingredients ===== */}
        <div className="form-group">
          <label>Ingredients*</label>
          {form.ingredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              index={index}
              ingredient={ingredient}
              onChange={handleIngredientChange}
              onRemove={removeIngredient}
              canRemove={form.ingredients.length > 1}
            />
          ))}
          {errors.ingredients && (
            <span className="error-text">{errors.ingredients}</span>
          )}
          <button
            type="button"
            onClick={addIngredient}
            className="add-ingredient-button"
          >
            Add Ingredient
          </button>
        </div>

        {/* ===== Preparation Steps ===== */}
        <div className="form-group">
          <label htmlFor="preparationSteps">Preparation Steps*</label>
          <textarea
            id="preparationSteps"
            value={form.preparationSteps}
            onChange={handleChange}
            required
          />
          {errors.preparationSteps && (
            <span className="error-text">{errors.preparationSteps}</span>
          )}
        </div>

        {/* ===== Cooking Time ===== */}
        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (minutes)*</label>
          <input
            type="number"
            id="cookingTime"
            value={form.cookingTime}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.cookingTime && (
            <span className="error-text">{errors.cookingTime}</span>
          )}
        </div>

        {/* ===== Servings ===== */}
        <div className="form-group">
          <label htmlFor="servings">Servings*</label>
          <input
            type="number"
            id="servings"
            value={form.servings}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.servings && (
            <span className="error-text">{errors.servings}</span>
          )}
        </div>

        {/* ===== Dietary Info ===== */}
        <div className="form-group">
          <label htmlFor="dietaryInfo">Dietary Information</label>
          <input
            type="text"
            id="dietaryInfo"
            value={form.dietaryInfo}
            placeholder="e.g. vegan, vegetarian..."
            onChange={handleChange}
          />
        </div>

        {/* ===== Category ===== */}
        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="add-recipe__select"
          >
            <option value="" disabled>
              Select Category
            </option>
            {foodCategoryOptions.map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="error-text">{errors.category}</span>
          )}
        </div>

        {/* ===== Photo ===== */}
        <div className="form-group">
          <label htmlFor="photo">Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

        {/* ===== Contains Gluten ===== */}
        <div className="form-group checkbox-group">
          <label htmlFor="containsGluten">Contains Gluten</label>
          <input
            type="checkbox"
            id="containsGluten"
            checked={form.containsGluten}
            onChange={handleChange}
          />
        </div>

        {/* ===== Submit Errors ===== */}
        {errors.submit && (
          <div className="error-text submit-error">{errors.submit}</div>
        )}

        {/* ===== Submit Button ===== */}
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
