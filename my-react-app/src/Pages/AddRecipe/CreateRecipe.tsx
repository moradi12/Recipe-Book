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
import "./CreateRecipe.css";

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
    <div className="create-recipe-page">
      <div className="create-recipe-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg className="chef-hat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="hero-title">Create Your Masterpiece</h1>
          <p className="hero-subtitle">Share your culinary creativity with the world</p>
          <div className="hero-breadcrumb">
            <span>Home</span>
            <svg className="breadcrumb-divider" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Create Recipe</span>
          </div>
        </div>
      </div>
      
      <div className="create-recipe-container">
        <div className="create-recipe-card">
          <div className="recipe-form-header">
            <h2 className="form-title">Recipe Details</h2>
            <div className="form-progress">
              <div className="progress-steps">
                <div className="step-item active">
                  <span className="step-number">1</span>
                  <span className="step-label">Basic Info</span>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <span className="step-number">2</span>
                  <span className="step-label">Details</span>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <span className="step-number">3</span>
                  <span className="step-label">Complete</span>
                </div>
              </div>
            </div>
          </div>
          
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
            <div className="action-buttons">
              <button
                type="button"
                onClick={() => navigate("/all/recipes")}
                className="btn-secondary cancel-btn"
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Recipe...
                  </>
                ) : (
                  <>
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Recipe
                  </>
                )}
              </button>
            </div>
            
            <div className="form-tips">
              <div className="tip-item">
                <svg className="tip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>All fields marked with * are required</span>
              </div>
              <div className="tip-item">
                <svg className="tip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Share your passion for cooking with others</span>
              </div>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;