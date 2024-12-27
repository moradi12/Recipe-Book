// src/components/CreateRecipe.tsx

import React from 'react';
import useRecipeForm from '../Redux/Hooks/useRecipeForm';
import './CreateRecipe.css';
import IngredientItem from './IngredientItem';

const CreateRecipe: React.FC = () => {
    const {
        form,
        errors,
        isSubmitting,
        handleChange,
        handleIngredientChange,
        addIngredient,
        removeIngredient,
        handleSubmit,
    } = useRecipeForm();

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
                    {isSubmitting ? 'Creating...' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );
};

export default CreateRecipe;
