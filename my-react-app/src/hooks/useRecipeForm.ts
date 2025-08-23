import { useCallback } from 'react';
import { useForm, validators } from './useForm';
import { Ingredient } from '../Models/Ingredient';

export interface RecipeFormData extends Record<string, unknown> {
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
  preparationTime: (value: unknown) => {
    const numValue = typeof value === 'number' ? value : Number(value);
    return validators.min(1, 'Preparation time must be at least 1 minute')(numValue);
  },
  cookingTime: (value: unknown) => {
    const numValue = typeof value === 'number' ? value : Number(value);
    return validators.min(1, 'Cooking time must be at least 1 minute')(numValue);
  },
  servings: (value: unknown) => {
    const numValue = typeof value === 'number' ? value : Number(value);
    return validators.min(1, 'Servings must be at least 1')(numValue);
  },
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
    const currentIngredients = form.values.ingredients as Ingredient[];
    form.setValue('ingredients', [...currentIngredients, newIngredient]);
  }, [form]);

  // Remove ingredient from the list
  const removeIngredient = useCallback((index: number) => {
    const currentIngredients = form.values.ingredients as Ingredient[];
    const newIngredients = currentIngredients.filter((_: Ingredient, i: number) => i !== index);
    form.setValue('ingredients', newIngredients);
  }, [form]);

  // Update specific ingredient
  const handleIngredientChange = useCallback((index: number, field: keyof Ingredient, value: string) => {
    const currentIngredients = form.values.ingredients as Ingredient[];
    const newIngredients = [...currentIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    form.setValue('ingredients', newIngredients);
  }, [form]);

  // Custom validation for ingredients
  const validateIngredients = useCallback(() => {
    const ingredients = form.values.ingredients as Ingredient[];
    if (ingredients.length === 0) {
      form.setError('ingredients', 'At least one ingredient is required');
      return false;
    }

    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
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