import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import RecipeService from "../../Service/RecipeService";
import { checkData } from "../../Utiles/checkData";
import { notify } from "../../Utiles/notif";
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
    // We are not using handleSubmit from the hook
  } = useRecipeForm();

  // We'll use the fetched categories to populate the dropdown.
  const [categories, setCategories] = useState<Category[]>([]);
  // Now we store the selected category ID (a number) or an empty string.
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await RecipeService.getAllCategories();
        // Assuming each category from the API includes an id and a name.
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Automatically set "createdBy" using checkData (for example, from a JWT)
  useEffect(() => {
    checkData(); // Ensure the user is logged in
    const storedJwt = sessionStorage.getItem("jwt");
    if (storedJwt) {
      const decodedJwt = JSON.parse(atob(storedJwt.split(".")[1])); // Decode JWT payload
      setForm((prev) => ({
        ...prev,
        createdBy: decodedJwt.sub, // Assuming "sub" is the user id or username
      }));
    }
  }, [setForm]);

  // Update the selectedCategoryId using the category's numeric id
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const parsedValue = Number(value);
      if (!isNaN(parsedValue)) {
        setSelectedCategoryId(parsedValue);
      } else {
        setSelectedCategoryId("");
      }
    },
    []
  );

  // Handle photo selection and convert to base64 for both preview and form storage
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // e.g., "data:image/png;base64,iVBORw0KG..."
        const fullResult = reader.result;
        const base64Part = fullResult.split(",")[1] || "";

        // Store raw base64 in form state
        setForm((prev) => ({
          ...prev,
          photo: base64Part,
        }));
        // Set the preview image
        setPhotoPreview(fullResult);
      }
    };
    reader.readAsDataURL(file);
  };

  // Render error messages if any exist
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

  // Form submission: Build the final request payload and call the API.
  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure that a valid category has been selected.
    if (selectedCategoryId === "") {
      notify.error("Please select a valid category.");
      return;
    }

    // Build the request payload.
    // Note: The API expects "categories" as an array of number IDs.
    const finalForm = {
      ...form,
      categoryIds: [selectedCategoryId],
    };

    const storedJwt = sessionStorage.getItem("jwt");
    if (!storedJwt) {
      notify.error("Please log in to create a recipe.");
      return;
    }

    try {
      const response = await RecipeService.createRecipe(finalForm, storedJwt);
      console.log("Created Recipe Response:", response.data);
      notify.success("Recipe created successfully!");
      navigate("/all/recipes");
    } catch (error) {
      console.error("Error creating recipe:", error);
      notify.error("Failed to create recipe. Please try again.");
    }
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

        {/* ===== Category ===== */}
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
