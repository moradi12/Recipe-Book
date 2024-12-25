// src/components/CreateRecipe.tsx

import axios from 'axios';
import React, { useState } from 'react';
import { FormState } from '../../Models/FormState';
import { IngredientRequest, RecipeCreateRequest } from '../../Models/RecipeCreateRequest';
import { notify } from '../../Utiles/notif'; // Ensure this import exists
import './CreateRecipe.css';
import IngredientItem from './IngredientItem';

const CreateRecipe: React.FC = () => {
    // Initialize form state
    const [form, setForm] = useState<FormState>({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '', unit: '' }],
        preparationSteps: '',
        cookingTime: 0,
        servings: 0,
        dietaryInfo: '',
        containsGluten: true,
        // categoryId has been removed
    });

    // Feedback state
    const [errors, setErrors] = useState<Record<string, string>>({});
    // Removed successMessage state if opting for only toast notifications
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Function to log all localStorage items (for debugging)
    const logLocalStorage = () => {
        console.log('--- localStorage Contents ---');
        Object.keys(localStorage).forEach(key => {
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        });
        console.log('--- End of localStorage ---');
    };

    // Generic handler for input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value, type } = e.target;
        let newValue: string | boolean | number = value;

        // Handle checkbox
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            newValue = e.target.checked;
        }

        // Handle number inputs
        if (type === 'number') {
            newValue = Number(value);
        }

        setForm(prev => ({
            ...prev,
            [id]: newValue,
        }));
    };

    // Handler for ingredient changes
    const handleIngredientChange = (index: number, field: keyof IngredientRequest, value: string) => {
        const updatedIngredients = form.ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setForm(prev => ({ ...prev, ingredients: updatedIngredients }));
    };

    // Add a new ingredient
    const addIngredient = () => {
        setForm(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
        }));
    };

    // Remove an ingredient
    const removeIngredient = (index: number) => {
        setForm(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    // Validate form data
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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        // Removed setSuccessMessage if opting for only toast notifications
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
            // categoryId has been removed
        };

        try {
            logLocalStorage(); // Debugging line
            const token = localStorage.getItem('authToken'); // Retrieves 'string | null'
            console.log('Submitting Recipe with Token:', token); // Debugging line

            if (!token) {
                setErrors({ submit: 'Authentication token is missing. Please log in.' });
                notify.error('Authentication token is missing. Please log in.');
                setIsSubmitting(false);
                return;
            }

            // Type assertion to assure TypeScript that 'token' is a string
            const authHeader: string = `Bearer ${token}`;
            const response = await axios.post('http://localhost:8080/api/recipes', recipeRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            });

            if (response.status === 201) { // Assuming 201 Created
                // setSuccessMessage('Recipe created successfully.'); // Remove if using only toast
                notify.success('Recipe created successfully!');
                // Reset form fields
                setForm({
                    title: '',
                    description: '',
                    ingredients: [{ name: '', quantity: '', unit: '' }],
                    preparationSteps: '',
                    cookingTime: 0,
                    servings: 0,
                    dietaryInfo: '',
                    containsGluten: true,
                    // categoryId has been removed
                });
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

    return (
        <div className="create-recipe-container">
            <h2>Create a New Recipe</h2>
            {Object.keys(errors).length > 0 && (
                <div className="error-messages">
                    <ul>
                        {Object.values(errors).map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Remove this line if using only toast notifications */}
            {/* {successMessage && <div className="success-message">{successMessage}</div>} */}
            <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                    <label htmlFor="description">Description*</label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>

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
                    {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}
                    <button type="button" onClick={addIngredient}>
                        Add Ingredient
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="preparationSteps">Preparation Steps*</label>
                    <textarea
                        id="preparationSteps"
                        value={form.preparationSteps}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {errors.preparationSteps && <span className="error-text">{errors.preparationSteps}</span>}
                </div>

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
                    {errors.cookingTime && <span className="error-text">{errors.cookingTime}</span>}
                </div>

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
                    {errors.servings && <span className="error-text">{errors.servings}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="dietaryInfo">Dietary Information</label>
                    <input
                        type="text"
                        id="dietaryInfo"
                        value={form.dietaryInfo}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="containsGluten">Contains Gluten</label>
                    <input
                        type="checkbox"
                        id="containsGluten"
                        checked={form.containsGluten}
                        onChange={handleChange}
                    />
                </div>

                {errors.submit && <div className="error-text">{errors.submit}</div>}

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );

};

export default CreateRecipe;
