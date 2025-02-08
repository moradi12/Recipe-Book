import React from "react";
import { IngredientRequest } from "../../Models/RecipeCreateRequest";
import IngredientItem from "./IngredientItem";

interface IngredientsListProps {
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

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  onIngredientChange,
  onRemoveIngredient,
  onAddIngredient,
  error,
}) => {
  return (
    <div className="form-group">
      <label><><p>Ingredients* </p></></label>
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

export default IngredientsList;
