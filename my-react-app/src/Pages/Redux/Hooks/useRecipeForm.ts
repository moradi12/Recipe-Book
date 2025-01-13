// src/Pages/Redux/Hooks/useRecipeForm.ts

import axios from 'axios';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormState } from '../../../Models/FormState';
import { IngredientRequest, RecipeCreateRequest } from '../../../Models/RecipeCreateRequest';
import RecipeService from '../../../Service/RecipeService';
import { notify } from '../../../Utiles/notif';
import { RootState } from '../RootState';

/**
 * Default form state, so we can reuse and reset easily.
 */
const DEFAULT_FORM_STATE: FormState = {
  title: '',
  description: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
  preparationSteps: '',
  cookingTime: 0,
  servings: 0,
  dietaryInfo: '',
  containsGluten: true,
  photo: '',
};

/**
 * Validate the form fields, returning an object
 * where keys are field names (or category) and values are error messages.
 */
function validateRecipeForm(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.title.trim()) {
    errors.title = 'Title is mandatory.';
  }
  if (!form.description.trim()) {
    errors.description = 'Description is mandatory.';
  }
  if (form.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required.';
  } else {
    form.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name.trim()) {
        errors[`ingredient-name-${index}`] = 'Ingredient name is required.';
      }
      if (!ingredient.quantity.trim()) {
        errors[`ingredient-quantity-${index}`] = 'Ingredient quantity is required.';
      }
      if (!ingredient.unit.trim()) {
        errors[`ingredient-unit-${index}`] = 'Ingredient unit is required.';
      }
    });
  }
  if (!form.preparationSteps.trim()) {
    errors.preparationSteps = 'Preparation steps are mandatory.';
  }
  if (form.cookingTime <= 0) {
    errors.cookingTime = 'Cooking time must be a positive number.';
  }
  if (form.servings <= 0) {
    errors.servings = 'Servings must be a positive number.';
  }

  return errors;
}

/**
 * Calls the API to create a new recipe.
 * Returns an object indicating whether it succeeded and an optional message.
 */
async function createRecipe(
  recipeRequest: RecipeCreateRequest,
  token: string
): Promise<{ isSuccess: boolean; message?: string }> {
  try {
    const response = await RecipeService.createRecipe(recipeRequest, token);
    // If the backend returns 201 for success, return success.
    if (response.status === 201) {
      return { isSuccess: true };
    }
    // Since RecipeResponse doesn't have a 'message' property,
    // we return a default error message.
    return {
      isSuccess: false,
      message: 'Failed to create recipe.',
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The server responded with a non-2xx code
        return {
          isSuccess: false,
          message: error.response.data.message || 'Failed to create recipe.',
        };
      } else if (error.request) {
        // Request was sent, but no response received
        return {
          isSuccess: false,
          message: 'No response from server. Please try again later.',
        };
      } else {
        // Something else happened in setting up the request
        return {
          isSuccess: false,
          message: 'An error occurred while setting up the request.',
        };
      }
    }
    // Non-Axios error
    return {
      isSuccess: false,
      message: 'An unexpected error occurred while creating the recipe.',
    };
  }
}

/**
 * useRecipeForm: Custom hook to manage recipe creation form state, validation, and submission.
 */
const useRecipeForm = () => {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM_STATE });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  /**
   * Generic input change handler (text, textarea, select, checkbox, number).
   */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { id, value, type } = e.target;
      let newValue: string | boolean | number = value;

      if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        newValue = e.target.checked;
      } else if (type === 'number') {
        newValue = Number(value);
      }

      setForm((prev: FormState) => ({
        ...prev,
        [id]: newValue,
      }));
    },
    []
  );

  /**
   * Updates a specific ingredient by index.
   */
  const handleIngredientChange = useCallback(
    (index: number, field: keyof IngredientRequest, value: string) => {
      setForm((prev: FormState) => {
        const updatedIngredients = prev.ingredients.map((ingredient, i) =>
          i === index ? { ...ingredient, [field]: value } : ingredient
        );
        return { ...prev, ingredients: updatedIngredients };
      });
    },
    []
  );

  /**
   * Adds a new, empty ingredient row.
   */
  const addIngredient = useCallback(() => {
    setForm((prev: FormState) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  }, []);

  /**
   * Removes an ingredient by index.
   */
  const removeIngredient = useCallback((index: number) => {
    setForm((prev: FormState) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  }, []);

  /**
   * Main submit handler. Validates the form, checks for auth token,
   * and calls the creation API.
   *
   * Accepts an optional selectedCategoryId (number).
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent, selectedCategoryId?: number) => {
      e.preventDefault();
      setErrors({});
      setIsSubmitting(true);
      console.log('Contains Gluten:', form.containsGluten);
      // Validate form fields
      const validationErrors = validateRecipeForm(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      if (!token) {
        const errorMsg = 'Authentication token is missing. Please log in.';
        setErrors({ submit: errorMsg });
        notify.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Build the request payload.
      // Use 'categories' property (not 'categoryIds') since that's what RecipeCreateRequest expects.
      const recipeRequest: RecipeCreateRequest = {
        title: form.title,
        description: form.description,
        ingredients: form.ingredients,
        preparationSteps: form.preparationSteps,
        cookingTime: form.cookingTime,
        servings: form.servings,
        dietaryInfo: form.dietaryInfo || undefined,
        containsGluten: form.containsGluten,
        photo: form.photo || '',
        categories: selectedCategoryId ? [selectedCategoryId] : [],
      };

      // Call createRecipe
      const { isSuccess, message } = await createRecipe(recipeRequest, token);

      if (isSuccess) {
        notify.success('Recipe created successfully!');
        // Reset the form to default
        setForm({ ...DEFAULT_FORM_STATE });
        // Redirect to home page
        navigate('/');
      } else {
        const errorMsg = message || 'Failed to create recipe.';
        setErrors({ submit: errorMsg });
        notify.error(errorMsg);
      }

      setIsSubmitting(false);
    },
    [form, token, navigate]
  );

  return {
    form,
    setForm, // exposing setForm if needed
    errors,
    isSubmitting,
    handleChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleSubmit,
  };
};

export default useRecipeForm;
