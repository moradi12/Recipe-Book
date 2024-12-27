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

const useRecipeForm = () => {
    const [form, setForm] = useState<FormState>({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
        preparationSteps: '',
        cookingTime: 0,
        servings: 0,
        dietaryInfo: '',
        containsGluten: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value, type } = e.target;
        let newValue: string | boolean | number = value;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            newValue = e.target.checked;
        }

        if (type === 'number') {
            newValue = Number(value);
        }

        setForm(prev => ({
            ...prev,
            [id]: newValue,
        }));
    };

    const handleIngredientChange = (index: number, field: keyof IngredientRequest, value: string) => {
        const updatedIngredients = form.ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setForm(prev => ({ ...prev, ingredients: updatedIngredients }));
    };

    const addIngredient = () => {
        setForm(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
        }));
    };

    const removeIngredient = (index: number) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const validateForm = (): boolean => {
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

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent, selectedCategory?: string) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

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

        try {
            if (!token) {
                setErrors({ submit: 'Authentication token is missing. Please log in.' });
                notify.error('Authentication token is missing. Please log in.');
                setIsSubmitting(false);
                return;
            }

            const response = await RecipeService.createRecipe(recipeRequest, token);

            if (response.status === 201) {
                notify.success('Recipe created successfully!');
                setForm({
                    title: '',
                    description: '',
                    ingredients: [{ name: '', quantity: '', unit: '' }],
                    preparationSteps: '',
                    cookingTime: 0,
                    servings: 0,
                    dietaryInfo: '',
                    containsGluten: true,
                });
                navigate('/');
            } else {
                setErrors({ submit: response.data.message || 'Failed to create recipe.' });
                notify.error(response.data.message || 'Failed to create recipe.');
            }
        } catch (error: unknown) {
            console.error('Error creating recipe:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setErrors({ submit: error.response.data.message || 'Failed to create recipe.' });
                    notify.error(error.response.data.message || 'Failed to create recipe.');
                } else if (error.request) {
                    setErrors({ submit: 'No response from server. Please try again later.' });
                    notify.error('No response from server. Please try again later.');
                } else {
                    setErrors({ submit: 'An error occurred while setting up the request.' });
                    notify.error('An error occurred while setting up the request.');
                }
            } else {
                setErrors({ submit: 'An unexpected error occurred while creating the recipe.' });
                notify.error('An unexpected error occurred while creating the recipe.');
            }
        } finally {
            setIsSubmitting(false);
        }
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
