import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import RecipeService from "../../Service/RecipeService";
import useRecipeForm from "../Redux/Hooks/useRecipeForm";
import "./CreateRecipe.css";
import IngredientItem from "./IngredientItem";

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

  // We'll store the numeric category ID or "" in local state.
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  /**
   * Fetch categories once (similar to how you do in GetAllRecipes).
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await RecipeService.getAllCategories();
        setCategories(response.data); // e.g. [{id:1, name:"Dessert"}, ...]
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /**
   * Handler for <select> changes: store the numeric ID or "".
   */
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedCategoryId(value ? Number(value) : "");
    },
    []
  );

  /**
   * Handler for photo upload: read as base64, store in form, and keep a local preview.
   */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const fullResult = reader.result; // "data:image/png;base64,iVBORw0KG..."
        const base64Part = fullResult.split(",")[1] || "";

        // Store raw base64 in form
        setForm((prev) => ({
          ...prev,
          photo: base64Part,
        }));

        // Show preview in UI
        setPhotoPreview(fullResult);
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Render any error messages in a list.
   */
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

  /**
   * We'll convert our numeric or "" category to a string or undefined
   * before calling handleSubmit, because `handleSubmit` expects string | undefined.
   */
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If selectedCategoryId is "" (meaning none), pass undefined
    // otherwise parse the string -> number
    const categoryAsNumber = 
      selectedCategoryId === "" ? undefined : Number(selectedCategoryId);
  
    // Now categoryAsNumber is a number or undefined
    handleSubmit(e, categoryAsNumber);
  };
  return (
    <div className="create-recipe-container">
      <h2>Create a New Recipe</h2>

      {renderErrorMessages()}

      <form onSubmit={onFormSubmit}>
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

        {/* ===== Category (Single) ===== */}
        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            required
            className="add-recipe__select"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
          {isSubmitting ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
