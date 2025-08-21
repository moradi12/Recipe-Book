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
    <div className="form-section fade-in">
      <h3>
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recipe Details
      </h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preparationTime">Prep Time (minutes)*</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="preparationTime"
              name="preparationTime"
              value={form.preparationTime}
              onChange={onInputChange}
              required
              min="1"
              placeholder="15"
              className="add-recipe__input"
            />
          </div>
          {errors.preparationTime && <span className="error-text">{errors.preparationTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cookingTime">Cook Time (minutes)*</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={form.cookingTime}
              onChange={onInputChange}
              required
              min="1"
              placeholder="30"
              className="add-recipe__input"
            />
          </div>
          {errors.cookingTime && <span className="error-text">{errors.cookingTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings*</label>
          <div className="input-wrapper">
            <input
              type="number"
              id="servings"
              name="servings"
              value={form.servings}
              onChange={onInputChange}
              required
              min="1"
              placeholder="4"
              className="add-recipe__input"
            />
          </div>
          {errors.servings && <span className="error-text">{errors.servings}</span>}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsSection;