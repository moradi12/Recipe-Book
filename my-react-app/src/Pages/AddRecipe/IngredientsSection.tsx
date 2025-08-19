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
      <input
        type="text"
        placeholder="Name"
        value={ingredient.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Quantity"
        value={ingredient.quantity}
        onChange={(e) => onChange(index, 'quantity', e.target.value)}
        required
      />
      <select
        value={ingredient.unit}
        onChange={(e) => onChange(index, 'unit', e.target.value)}
        required
      >
        {UNIT_OPTIONS.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </select>
      {canRemove && (
        <button type="button" onClick={() => onRemove(index)}>
          Remove
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
    <div className="form-group">
      <label>
        <p>Ingredients*</p>
      </label>
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
      {error && <span className="error-text">{error}</span>}
      <button
        type="button"
        onClick={onAddIngredient}
        className="add-ingredient-button"
      >
        Add Ingredient
      </button>
    </div>
  );
};

export default IngredientsSection;