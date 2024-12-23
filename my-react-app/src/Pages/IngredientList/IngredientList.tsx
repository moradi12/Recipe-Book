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

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="ingredient-list-container">
      <label>Ingredients:</label>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient}
            <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add ingredient"
        value={newIngredient}
        onChange={(e) => setNewIngredient(e.target.value)}
      />
      <button onClick={handleAddIngredient}>Add</button>
    </div>
  );
};

export default IngredientList;
