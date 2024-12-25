import React from "react";
import { Recipe } from "../../Models/Recipe";

const RecipeDetails: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  return (
    <div>
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      <h4>Categories:</h4>
      <ul>
        {recipe.categories.map((category) => (
          <li key={category.id}>
            {category.name} ({category.foodCategory.replace("_", " ")})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeDetails;
