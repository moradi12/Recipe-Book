import { useCallback } from 'react';
import { useForm, validators } from './useForm';
import { Ingredient } from '../Models/Ingredient';

export interface RecipeFormData {
  title: string;
  description: string;
  instructions: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  ingredients: Ingredient[];
}

const initialRecipeData: RecipeFormData = {
  title: '',
  description: '',
  instructions: '',
  preparationTime: 0,
  cookingTime: 0,
  servings: 1,
  ingredients: [],
};

const recipeValidationRules = {
  title: validators.required('Recipe title is required'),
  description: validators.required('Recipe description is required'),
  instructions: validators.required('Recipe instructions are required'),
  preparationTime: validators.min(1, 'Preparation time must be at least 1 minute'),
  cookingTime: validators.min(1, 'Cooking time must be at least 1 minute'),
  servings: validators.min(1, 'Servings must be at least 1'),
};

export function useRecipeForm() {
  const form = useForm(initialRecipeData, recipeValidationRules);

  // Add ingredient to the list
  const addIngredient = useCallback(() => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(), // Simple ID generation as string
      name: '',
      quantity: '',
      unit: '',
    };
    form.setValue('ingredients', [...form.values.ingredients, newIngredient]);
  }, [form]);

  // Remove ingredient from the list
  const removeIngredient = useCallback((index: number) => {
    const newIngredients = form.values.ingredients.filter((_, i) => i !== index);
    form.setValue('ingredients', newIngredients);
  }, [form]);

  // Update specific ingredient
  const handleIngredientChange = useCallback((index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...form.values.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    form.setValue('ingredients', newIngredients);
  }, [form]);

  // Custom validation for ingredients
  const validateIngredients = useCallback(() => {
    if (form.values.ingredients.length === 0) {
      form.setError('ingredients', 'At least one ingredient is required');
      return false;
    }

    for (let i = 0; i < form.values.ingredients.length; i++) {
      const ingredient = form.values.ingredients[i];
      if (!ingredient.name.trim() || !ingredient.quantity.trim()) {
        form.setError('ingredients', `Ingredient ${i + 1} must have both name and quantity`);
        return false;
      }
    }

    form.setError('ingredients', '');
    return true;
  }, [form]);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const baseValid = form.validate();
    const ingredientsValid = validateIngredients();
    return baseValid && ingredientsValid;
  }, [form, validateIngredients]);

  return {
    form: form.values,
    setForm: form.setValue,
    errors: form.errors,
    isSubmitting: form.isSubmitting,
    handleChange: form.handleChange,
    addIngredient,
    removeIngredient,
    handleIngredientChange,
    validate: validateForm,
    reset: form.reset,
    setSubmitting: form.setSubmitting,
  };
}

export default useRecipeForm;