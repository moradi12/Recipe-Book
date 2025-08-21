import React from "react";
import { IngredientRequest } from "../../Models/RecipeCreateRequest";
import { UNIT_OPTIONS } from "../../Models/constants";

interface IngredientsSectionProps {
  ingredients: IngredientRequest[];
  onIngredientChange: (
    index: number,
    field: keyof IngredientRequest,
    value: string
  ) => void;
  onRemoveIngredient: (index: number) => void;
  onAddIngredient: () => void;
  error?: string;
}

const IngredientItem: React.FC<{
  index: number;
  ingredient: IngredientRequest;
  onChange: (index: number, field: keyof IngredientRequest, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}> = ({ index, ingredient, onChange, onRemove, canRemove }) => {
  return (
    <div className="ingredient-item">
      <div className="ingredient-number">
        {index + 1}
      </div>
      
      <div className="ingredient-fields">
        <div className="ingredient-field">
          <label className="field-label">Ingredient</label>
          <input
            type="text"
            placeholder="e.g., Flour, Eggs, Sugar"
            value={ingredient.name}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            required
            className="add-recipe__input ingredient-input"
          />
        </div>
        
        <div className="ingredient-field quantity-field">
          <label className="field-label">Amount</label>
          <input
            type="text"
            placeholder="2"
            value={ingredient.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            required
            className="add-recipe__input ingredient-input"
          />
        </div>
        
        <div className="ingredient-field unit-field">
          <label className="field-label">Unit</label>
          <select
            value={ingredient.unit}
            onChange={(e) => onChange(index, 'unit', e.target.value)}
            required
            className="add-recipe__select ingredient-select"
          >
            {UNIT_OPTIONS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {canRemove && (
        <button 
          type="button" 
          onClick={() => onRemove(index)}
          className="remove-ingredient-btn"
          title="Remove ingredient"
        >
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  onIngredientChange,
  onRemoveIngredient,
  onAddIngredient,
  error,
}) => {
  return (
    <div className="form-section fade-in">
      <h3>
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h2a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Ingredients
      </h3>
      
      <div className="ingredients-container">
        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              index={index}
              ingredient={ingredient}
              onChange={onIngredientChange}
              onRemove={onRemoveIngredient}
              canRemove={ingredients.length > 1}
            />
          ))}
        </div>
        
        {error && <span className="error-text ingredient-error">{error}</span>}
        
        <button
          type="button"
          onClick={onAddIngredient}
          className="add-ingredient-btn"
        >
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Ingredient
        </button>
        
        <div className="ingredients-helper">
          <div className="helper-item">
            <svg className="helper-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>List ingredients in the order they'll be used. Be specific with measurements!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsSection;