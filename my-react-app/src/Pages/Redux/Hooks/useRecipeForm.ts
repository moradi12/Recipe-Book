/**
 * @deprecated Use the new useForm hook from '../../hooks/useForm' and useRecipes hook instead
 */
import { useForm, validators } from '../../../hooks/useForm';
import { useRecipes } from '../../../hooks/useRecipes';
import { FormState } from '../../../Models/FormState';
import { IngredientRequest, RecipeCreateRequest } from '../../../Models/RecipeCreateRequest';

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
 * @deprecated Use the new useForm and useRecipes hooks instead
 * This is kept for backward compatibility
 */
const useRecipeForm = () => {
  console.warn('useRecipeForm is deprecated. Please use useForm and useRecipes hooks instead.');
  
  const { createRecipe } = useRecipes();
  
  const formHook = useForm<FormState>(
    DEFAULT_FORM_STATE,
    {
      title: validators.required('Title is required'),
      description: validators.required('Description is required'),
      preparationSteps: validators.required('Preparation steps are required'),
      cookingTime: (value) => value <= 0 ? 'Cooking time must be positive' : undefined,
      servings: (value) => value <= 0 ? 'Servings must be positive' : undefined,
    }
  );

  // Compatibility methods
  const handleIngredientChange = (index: number, field: keyof IngredientRequest, value: string) => {
    const updatedIngredients = formHook.values.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    formHook.setValue('ingredients', updatedIngredients);
  };

  const addIngredient = () => {
    formHook.setValue('ingredients', [...formHook.values.ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    formHook.setValue('ingredients', formHook.values.ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, selectedCategoryId?: number) => {
    e.preventDefault();
    
    if (!formHook.validate()) {
      return;
    }

    const recipeRequest: RecipeCreateRequest = {
      ...formHook.values,
      categoryIds: selectedCategoryId ? [selectedCategoryId] : [],
    };

    await createRecipe(recipeRequest);
  };

  return {
    form: formHook.values,
    setForm: (newForm: FormState) => {
      Object.keys(newForm).forEach(key => {
        formHook.setValue(key as keyof FormState, newForm[key as keyof FormState]);
      });
    },
    errors: formHook.errors,
    isSubmitting: formHook.isSubmitting,
    handleChange: formHook.handleChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleSubmit,
  };
};

export default useRecipeForm;
