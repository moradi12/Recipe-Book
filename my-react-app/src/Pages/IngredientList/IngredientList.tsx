import React, { useState } from "react";
import "./IngredientList.css";

interface IngredientListProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  setIngredients,
}) => {
  const [newIngredient, setNewIngredient] = useState("");
  const [error, setError] = useState("");

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) {
      setError("Ingredient cannot be empty.");
      return;
    }
    if (ingredients.includes(newIngredient.trim())) {
      setError("Ingredient already exists.");
      return;
    }
    setIngredients([...ingredients, newIngredient.trim()]);
    setNewIngredient("");
    setError("");
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <div className="ingredient-list-container">
      <label>Ingredients:</label>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient}
            <button
              onClick={() => handleRemoveIngredient(index)}
              aria-label={`Remove ${ingredient}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add ingredient"
        value={newIngredient}
        onChange={(e) => setNewIngredient(e.target.value)}
        onKeyPress={handleKeyPress}
        aria-describedby="error-message"
      />
      <button onClick={handleAddIngredient}>Add</button>
      {error && <div id="error-message" className="error-message">{error}</div>}
    </div>
  );
};

export default IngredientList;
