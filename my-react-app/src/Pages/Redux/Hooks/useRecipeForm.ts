// src/hooks/useRecipeForm.ts

import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormState } from '../../../Models/FormState';
import { IngredientRequest, RecipeCreateRequest } from '../../../Models/RecipeCreateRequest';
import RecipeService from '../../../Service/RecipeService';
import { notify } from '../../../Utiles/notif';
import { RootState } from '../RootState';

/** A helper constant for default form state. */
const DEFAULT_FORM_STATE: FormState = {
  title: '',
  description: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
  preparationSteps: '',
  cookingTime: 0,
  servings: 0,
  dietaryInfo: '',
  containsGluten: true,
};

/**
 * Validate the form fields. Returns an object where
 * the keys are field identifiers and the values are error messages.
 */
function validateRecipeForm(form: FormState): Record<string, string> {
  const validationErrors: Record<string, string> = {};

  if (!form.title.trim()) {
    validationErrors.title = 'Title is mandatory.';
  }
  if (!form.description.trim()) {
    validationErrors.description = 'Description is mandatory.';
  }
  if (form.ingredients.length === 0) {
    validationErrors.ingredients = 'At least one ingredient is required.';
  } else {
    form.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name.trim()) {
        validationErrors[`ingredient-name-${index}`] = 'Name is required.';
      }
      if (!ingredient.quantity.trim()) {
        validationErrors[`ingredient-quantity-${index}`] = 'Quantity is required.';
      }
      if (!ingredient.unit.trim()) {
        validationErrors[`ingredient-unit-${index}`] = 'Unit is required.';
      }
    });
  }
  if (!form.preparationSteps.trim()) {
    validationErrors.preparationSteps = 'Preparation steps are mandatory.';
  }
  if (form.cookingTime <= 0) {
    validationErrors.cookingTime = 'Cooking time must be a positive number.';
  }
  if (form.servings <= 0) {
    validationErrors.servings = 'Servings must be a positive number.';
  }

  return validationErrors;
}

/**
 * Attempt to create a recipe via RecipeService and handle various Axios error scenarios.
 */
async function createRecipe(
  recipeRequest: RecipeCreateRequest,
  token: string
): Promise<{ isSuccess: boolean; message?: string }> {
  try {
    const response = await RecipeService.createRecipe(recipeRequest, token);
    if (response.status === 201) {
      return { isSuccess: true };
    }
    return { isSuccess: false, message: response.data.message || 'Failed to create recipe.' };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          isSuccess: false,
          message: error.response.data.message || 'Failed to create recipe.',
        };
      } else if (error.request) {
        return {
          isSuccess: false,
          message: 'No response from server. Please try again later.',
        };
      } else {
        return {
          isSuccess: false,
          message: 'An error occurred while setting up the request.',
        };
      }
    }
    return {
      isSuccess: false,
      message: 'An unexpected error occurred while creating the recipe.',
    };
  }
}

const useRecipeForm = () => {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM_STATE });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  /** Handle any generic input changes (text, textarea, select, etc.). */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    let newValue: string | boolean | number = value;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    } else if (type === 'number') {
      newValue = Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  /** Handle changes for each ingredient in the array of ingredients. */
  const handleIngredientChange = (index: number, field: keyof IngredientRequest, value: string) => {
    setForm((prev) => {
      const updatedIngredients = prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      );
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  /** Main submit handler. */
  const handleSubmit = async (e: React.FormEvent, selectedCategory?: string) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

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

    // Build the request payload
    const recipeRequest: RecipeCreateRequest = {
      title: form.title,
      description: form.description,
      ingredients: form.ingredients,
      preparationSteps: form.preparationSteps,
      cookingTime: form.cookingTime,
      servings: form.servings,
      dietaryInfo: form.dietaryInfo || undefined,
      containsGluten: form.containsGluten,
    };

    // Call createRecipe
    const { isSuccess, message } = await createRecipe(recipeRequest, token);

    if (isSuccess) {
      notify.success('Recipe created successfully!');
      setForm({ ...DEFAULT_FORM_STATE }); // Reset form
      navigate('/');
    } else {
      const errorMsg = message || 'Failed to create recipe.';
      setErrors({ submit: errorMsg });
      notify.error(errorMsg);
    }

    setIsSubmitting(false);
  };

  return {
    form,
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
