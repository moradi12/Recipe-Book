import React from 'react';

interface RecipeDetailsSectionProps {
  form: {
    preparationTime: number;
    cookingTime: number;
    servings: number;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RecipeDetailsSection: React.FC<RecipeDetailsSectionProps> = ({
  form,
  errors,
  onInputChange
}) => {
  return (
    <div className="form-section">
      <h3>Recipe Details</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preparationTime">Prep Time (minutes)*</label>
          <input
            type="number"
            id="preparationTime"
            name="preparationTime"
            value={form.preparationTime}
            onChange={onInputChange}
            required
            min="1"
            className="add-recipe__input"
          />
          {errors.preparationTime && <span className="error-text">{errors.preparationTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cookingTime">Cook Time (minutes)*</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={form.cookingTime}
            onChange={onInputChange}
            required
            min="1"
            className="add-recipe__input"
          />
          {errors.cookingTime && <span className="error-text">{errors.cookingTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings*</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={form.servings}
            onChange={onInputChange}
            required
            min="1"
            className="add-recipe__input"
          />
          {errors.servings && <span className="error-text">{errors.servings}</span>}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsSection;