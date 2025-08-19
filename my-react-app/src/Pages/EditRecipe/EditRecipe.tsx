import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useRecipes } from "../../hooks";
import { useRecipeForm } from "../../hooks/useRecipeForm";
import { IngredientRequest, RecipeCreateRequest } from "../../Models/RecipeCreateRequest";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";
import BasicInfoSection from "../AddRecipe/BasicInfoSection";
import RecipeDetailsSection from "../AddRecipe/RecipeDetailsSection";
import IngredientsSection from "../AddRecipe/IngredientsSection";
import InstructionsSection from "../AddRecipe/InstructionsSection";
import PhotoSection from "../AddRecipe/PhotoSection";

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

const EditRecipe: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { categories, updateRecipe, fetchCategories } = useRecipes();
  
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
    setForm,
  } = useRecipeForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");

  // Fetch existing recipe and populate form
  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");

      const response = await RecipeService.getRecipeById(Number(id));
      const existing: RecipeResponse = response.data;

      // Convert RecipeResponse to form data
      const parsedIngredients: IngredientRequest[] = existing.ingredients.map((str) => {
        const parts = str.split(" of ");
        if (parts.length === 2) {
          const [qty, unit] = parts[0].split(" ");
          return {
            name: parts[1].trim(),
            quantity: qty || "1",
            unit: unit || "",
          };
        }
        return {
          name: str.trim(),
          quantity: "1",
          unit: "",
        };
      });

      // Set form data using the hook
      setForm({
        title: existing.title,
        description: existing.description,
        cookingTime: existing.cookingTime,
        servings: existing.servings,
        ingredients: parsedIngredients,
        instructions: existing.preparationSteps || "",
      });

      // Set category if available
      if (existing.categoryIds && existing.categoryIds.length > 0) {
        setSelectedCategoryId(existing.categoryIds[0]);
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe for editing.");
    } finally {
      setLoading(false);
    }
  }, [id, setForm]);

  useEffect(() => {
    if (!requireAuth()) return;
    fetchRecipe();
    fetchCategories();
  }, [fetchRecipe, fetchCategories, requireAuth]);

  const handleCategoryChange = useCallback((value: string) => {
    const parsedValue = Number(value);
    setSelectedCategoryId(!isNaN(parsedValue) ? parsedValue : "");
  }, []);

  const handlePhotoChange = useCallback((file: File) => {
    console.log('Photo selected:', file.name);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      notify.error("No recipe ID in the URL!");
      return;
    }

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
        preparationSteps: form.instructions,
        cookingTime: form.cookingTime,
        servings: form.servings,
        containsGluten: false,
        categoryIds: [selectedCategoryId],
      };

      const success = await updateRecipe(Number(id), finalForm as any);
      if (success) {
        notify.success("Recipe updated successfully!");
        navigate("/all/recipes");
      } else {
        notify.error("Failed to update recipe. Please try again.");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      notify.error("Failed to update recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading states
  if (loading && !form.title && !error) {
    return <div>Loading recipe...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit-recipe-container">
      <div className="edit-recipe-card">
        <h2 className="edit-recipe-title">Edit Recipe</h2>
        
        <ErrorMessages errors={errors} />

        <form onSubmit={handleFormSubmit} className="edit-recipe-form">
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
              {isSubmitting ? "Updating Recipe..." : "Update Recipe"}
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

export default EditRecipe;
