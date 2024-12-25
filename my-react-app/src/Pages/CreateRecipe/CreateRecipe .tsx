import React, { ChangeEvent, useState } from "react";
import { Recipe } from "../../Models/Recipe";
import { RecipeService } from "../../Service/RecipeService";
import RecipeForm from "../RecipeForm/RecipeForm";
import './CreateRecipe.css';

const CreateRecipe: React.FC = () => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: "",
    title: "",
    description: "",
    ingredients: [],
    preparationSteps: "",
    cookingTime: 0,
    servings: 0,
    dietaryInfo: "",
    containsGluten: true,
    status: "DRAFT", 
  });

  const [newIngredient, setNewIngredient] = useState("");
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [measurementUnit, setMeasurementUnit] = useState("grams");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleContainsGlutenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      containsGluten: e.target.checked,
    }));
  };

  const handleIngredientAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]+$/.test(value)) {
      setIngredientAmount(value);
    }
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim() || !ingredientAmount.trim()) {
      setError("Both ingredient name and amount are required.");
      return;
    }

    const ingredientWithUnit = `${ingredientAmount} ${measurementUnit} of ${newIngredient.trim()}`;

    if (recipe.ingredients?.includes(ingredientWithUnit)) {
      setError("Ingredient already exists.");
      return;
    }

    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...(prevRecipe.ingredients || []), ingredientWithUnit],
    }));

    setNewIngredient("");
    setIngredientAmount("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!recipe.name || !recipe.title || !recipe.description) {
      setError("Please fill in all the required fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await RecipeService.createRecipe(recipe);
      if (response) {
        alert("Recipe created successfully!");
        setRecipe({
          name: "",
          title: "",
          description: "",
          ingredients: [],
          preparationSteps: "",
          cookingTime: 0,
          servings: 0,
          dietaryInfo: "",
          containsGluten: true,
          status: "DRAFT",
        });
      } else {
        setError("Failed to create the recipe. Please try again.");
      }
    } catch (err) {
      setError("Error creating recipe. Please try again.");
      console.error("Error creating recipe:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Create a New Recipe</h2>

      {error && <div className="error-message">{error}</div>}

      <RecipeForm recipe={recipe} onInputChange={handleInputChange} />

      <div className="gluten-info">
        <label>
          <input
            type="checkbox"
            checked={recipe.containsGluten}
            onChange={handleContainsGlutenChange}
          />
          Contains Gluten
        </label>
      </div>

      <div className="ingredient-container">
        <input
          type="text"
          placeholder="Ingredient name"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={ingredientAmount}
          onChange={handleIngredientAmountChange}
        />
        <select
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
        >
  <option value="grams">Grams</option>
  <option value="milligrams">Milligrams</option>
  <option value="kg">Kilograms</option> {/* Added kg */}
  <option value="ml">Milliliters</option>
  <option value="liters">Liters</option> {/* Added liters */}
  <option value="cup">Cup</option>
  <option value="tbsp">Tablespoons</option> {/* Added tablespoons */}
  <option value="tsp">Teaspoons</option> {/* Added teaspoons */}
  <option value="pieces">Pieces</option> {/* Added pieces */}        </select>
        <button onClick={handleAddIngredient}>Add Ingredient</button>
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
  <div className="ingredients-list">
    <h4>Ingredients:</h4>
    <ul>
      {recipe.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>
  </div>
)}

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Recipe"}
      </button>
    </div>
  );
};

export default CreateRecipe;
