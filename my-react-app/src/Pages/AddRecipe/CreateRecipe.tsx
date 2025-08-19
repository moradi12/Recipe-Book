import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useRecipes } from "../../hooks";
import { useRecipeForm } from "../../hooks/useRecipeForm";
import { notify } from "../../Utiles/notif";
import BasicInfoSection from "./BasicInfoSection";
import RecipeDetailsSection from "./RecipeDetailsSection";
import IngredientsSection from "./IngredientsSection";
import InstructionsSection from "./InstructionsSection";
import PhotoSection from "./PhotoSection";

const ErrorMessages: React.FC<{ errors: Record<string, string> }> = ({ errors }) => {
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
};

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { categories, createRecipe, fetchCategories } = useRecipes();
  
  const {
    form,
    errors,
    isSubmitting,
    handleChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    validate,
    setSubmitting,
  } = useRecipeForm();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");

  // Auth check and fetch categories
  useEffect(() => {
    if (!requireAuth()) return;
    fetchCategories();
  }, [requireAuth, fetchCategories]);

  const handleCategoryChange = useCallback((value: string) => {
    const parsedValue = Number(value);
    setSelectedCategoryId(!isNaN(parsedValue) ? parsedValue : "");
  }, []);

  const handlePhotoChange = useCallback((file: File) => {
    // Photo upload logic will be implemented when needed
    console.log('Photo selected:', file.name);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || selectedCategoryId === "") {
      notify.error(!validate() ? "Please fix the errors in the form." : "Please select a valid category.");
      return;
    }

    if (!requireAuth()) return;

    setSubmitting(true);

    try {
      const finalForm = {
        title: form.title,
        description: form.description,
        ingredients: form.ingredients,
        preparationSteps: form.instructions, // Map instructions to preparationSteps
        cookingTime: form.cookingTime,
        servings: form.servings,
        containsGluten: false, // Default value, could be made configurable
        categoryIds: [selectedCategoryId],
        // Optional fields that could be added later:
        // photo: selectedPhoto ? convertToBase64(selectedPhoto) : undefined,
        // dietaryInfo: form.dietaryInfo,
      };

      const success = await createRecipe(finalForm);
      if (success) {
        notify.success("Recipe created successfully!");
        navigate("/all/recipes");
      } else {
        notify.error("Failed to create recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      notify.error("Failed to create recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-recipe-container">
      <div className="create-recipe-card">
        <h2 className="create-recipe-title">Create New Recipe</h2>
        
        <ErrorMessages errors={errors} />

        <form onSubmit={handleFormSubmit} className="create-recipe-form">
          <BasicInfoSection
            form={form}
            errors={errors}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onInputChange={handleChange}
            onCategoryChange={handleCategoryChange}
          />

          <RecipeDetailsSection
            form={form}
            errors={errors}
            onInputChange={handleChange}
          />

          <div className="form-section">
            <h3>Ingredients</h3>
            <IngredientsSection
              ingredients={form.ingredients}
              onIngredientChange={handleIngredientChange}
              onRemoveIngredient={removeIngredient}
              onAddIngredient={addIngredient}
              error={errors.ingredients}
            />
          </div>

          <InstructionsSection
            instructions={form.instructions}
            error={errors.instructions}
            onInputChange={handleChange}
          />

          <PhotoSection onPhotoChange={handlePhotoChange} />

          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/all/recipes")}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;