import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FoodCategory } from '../../Models/FoodCategory';
import RecipeService from '../../Service/RecipeService';
import useRecipeForm from '../Redux/Hooks/useRecipeForm';
import './EditRecipe.css';
import IngredientItem from './IngredientItem';

const EditRecipe: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get recipe ID from URL
    const navigate = useNavigate();

    const {
        form,
        setForm,
        errors,
        isSubmitting,
        handleChange,
        handleIngredientChange,
        addIngredient,
        removeIngredient,
        handleSubmit,
    } = useRecipeForm();

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const foodCategoryOptions = Object.values(FoodCategory);

    // Fetch recipe data on component mount
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await RecipeService.getRecipeById(id);
                const recipe = response.data;
                setForm({
                    title: recipe.title,
                    description: recipe.description,
                    ingredients: recipe.ingredients || [''],
                    preparationSteps: recipe.preparationSteps,
                    cookingTime: recipe.cookingTime,
                    servings: recipe.servings,
                    dietaryInfo: recipe.dietaryInfo || '',
                    containsGluten: recipe.containsGluten || false,
                });
                setSelectedCategory(recipe.category);
            } catch (error) {
                console.error('Error fetching recipe:', error);
                navigate('/recipes'); // Redirect if recipe not found
            }
        };

        fetchRecipe();
    }, [id, navigate, setForm]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await handleSubmit(e, selectedCategory, id); // Pass ID for updating
            navigate('/recipes'); // Redirect after successful update
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    };

    return (
        <div className="edit-recipe-container">
            <h2>Edit Recipe</h2>
            {Object.keys(errors).length > 0 && (
                <div className="error-messages">
                    <ul>
                        {Object.values(errors).map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleUpdate}>
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
                    <button type="button" onClick={addIngredient} className="add-ingredient-button">
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
                    <label htmlFor="category">Category*</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        required
                        className="edit-recipe__select"
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        {foodCategoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group checkbox-group">
                    <label htmlFor="containsGluten">Contains Gluten</label>
                    <input
                        type="checkbox"
                        id="containsGluten"
                        checked={form.containsGluten}
                        onChange={handleChange}
                    />
                </div>

                {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Recipe'}
                </button>
            </form>
        </div>
    );
};

export default EditRecipe;
