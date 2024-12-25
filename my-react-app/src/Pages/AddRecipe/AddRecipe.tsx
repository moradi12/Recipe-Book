// Updated AddRecipe.tsx

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Category } from "../../Models/Category";
import { Ingredient } from "../../Models/Ingredient";
import "./AddRecipe.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AddRecipe: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: Date.now(), name: "", quantity: "", unit: "" },
  ]);
  const [preparationSteps, setPreparationSteps] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(0);
  const [dietaryInfo, setDietaryInfo] = useState<string>("");
  const [containsGluten, setContainsGluten] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const unitOptions = [
    "grams",
    "milliliters",
    "cups",
    "tablespoons",
    "teaspoons",
    "pieces",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
        setAvailableCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    key: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [key]: value };
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const recipe = {
        title,
        description,
        ingredients,
        preparationSteps,
        cookingTime,
        servings,
        dietaryInfo,
        containsGluten,
        categories,
    };

    try {
        const token = localStorage.getItem("token"); // Fetch the token from local storage
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.post(
            `${API_BASE_URL}/api/recipes`,
            recipe,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Add the Authorization header
                },
            }
        );
        setMessage("Recipe added successfully!");
        resetForm(); // Reset the form fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error:", error);
        if (error.response) {
            console.error("Server Response:", error.response.data); // Log server error details
        }
        setMessage("Failed to add recipe. Please check your input.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="add-recipe">
      <h2 className="add-recipe__title">Add Recipe</h2>
      {message && <p className="add-recipe__message">{message}</p>}
      {loading && <div className="spinner"></div>}
      <form className="add-recipe__form" onSubmit={handleSubmit}>
        <label className="add-recipe__label">
          Title:
          <input
            type="text"
            className="add-recipe__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="add-recipe__label">
          Description:
          <textarea
            className="add-recipe__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <fieldset className="add-recipe__fieldset">
          <legend className="add-recipe__legend">Ingredients</legend>
          {ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="add-recipe__ingredient-row">
              <input
                type="text"
                placeholder="Ingredient Name"
                value={ingredient.name}
                className="add-recipe__ingredient-input"
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                className="add-recipe__ingredient-input"
                onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                required
              />
              <select
                value={ingredient.unit}
                className="add-recipe__ingredient-select"
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                required
              >
                <option value="" disabled>Select Unit</option>
                {unitOptions.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              <button
                type="button"
                className="add-recipe__remove-button"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-recipe__add-ingredient-button"
            onClick={addIngredient}
          >
            Add Ingredient
          </button>
        </fieldset>
        <label className="add-recipe__label">
          Preparation Steps:
          <textarea
            className="add-recipe__textarea"
            value={preparationSteps}
            onChange={(e) => setPreparationSteps(e.target.value)}
            required
          />
        </label>
        <label className="add-recipe__label">
          Cooking Time (minutes):
          <input
            type="number"
            className="add-recipe__input"
            value={cookingTime}
            onChange={(e) => setCookingTime(Number(e.target.value))}
            required
          />
        </label>
        <label className="add-recipe__label">
          Servings:
          <input
            type="number"
            className="add-recipe__input"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            required
          />
        </label>
        <label className="add-recipe__label">
          Dietary Info:
          <textarea
            className="add-recipe__textarea"
            value={dietaryInfo}
            onChange={(e) => setDietaryInfo(e.target.value)}
            placeholder="Enter details such as vegan, vegetarian, etc."
          />
        </label>
        <label className="add-recipe__label">
          Contains Gluten:
          <input
            type="checkbox"
            className="add-recipe__checkbox"
            checked={containsGluten}
            onChange={(e) => setContainsGluten(e.target.checked)}
          />
        </label>
        <label className="add-recipe__label">
          Categories:
          <select
            className="add-recipe__select"
            multiple
            value={categories.map((cat) => String(cat.id))}
            onChange={(e) =>
              setCategories(
                Array.from(e.target.selectedOptions, (option) =>
                  availableCategories.find((cat) => cat.id === Number(option.value))!
                )
              )
            }
          >
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="add-recipe__button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
function resetForm() {
  throw new Error("Function not implemented.");
}

