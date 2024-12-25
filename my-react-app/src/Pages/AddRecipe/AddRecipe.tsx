import axios from "axios";
import React, { useState } from "react";
import { Category } from "../../Models/Category";
import { Ingredient } from "../../Models/Ingredient";

const AddRecipe: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [preparationSteps, setPreparationSteps] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(0);
  const [dietaryInfo, setDietaryInfo] = useState<string>("");
  const [containsGluten, setContainsGluten] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setAvailableCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAvailableCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: 0, name: "", quantity: "", unit: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredient = { ...ingredients[index], [field]: value };
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = updatedIngredient;
    setIngredients(updatedIngredients);
  };

  const handleCategoryToggle = (category: Category) => {
    if (categories.find((cat) => cat.id === category.id)) {
      setCategories(categories.filter((cat) => cat.id !== category.id));
    } else {
      setCategories([...categories, category]);
    }
  };

  const validateForm = () => {
    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return false;
    }
    if (ingredients.length === 0) {
      setMessage("At least one ingredient is required.");
      return false;
    }
    setMessage("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const recipeData = {
      title,
      description,
      ingredients,
      preparationSteps,
      cookingTime,
      servings,
      dietaryInfo,
      containsGluten,
      categories: categories.map((category) => category.id),
    };

    setLoading(true);
    try {
      const response = await axios.post("/api/recipes", recipeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage(`Recipe created successfully: ${response.data.title}`);
      setTitle("");
      setDescription("");
      setIngredients([]);
      setPreparationSteps("");
      setCookingTime(0);
      setServings(0);
      setDietaryInfo("");
      setContainsGluten(true);
      setCategories([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      setMessage(
        error.response?.data?.message || "An unexpected error occurred while creating the recipe."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add a Recipe</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              placeholder="Name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
            />
            <input
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
            />
            <input
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleAddIngredient}>Add Ingredient</button>
      </div>
      <div>
        <label>Preparation Steps:</label>
        <textarea
          value={preparationSteps}
          onChange={(e) => setPreparationSteps(e.target.value)}
        />
      </div>
      <div>
        <label>Cooking Time (minutes):</label>
        <input
          type="number"
          value={cookingTime}
          onChange={(e) => setCookingTime(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Servings:</label>
        <input
          type="number"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Dietary Info:</label>
        <input value={dietaryInfo} onChange={(e) => setDietaryInfo(e.target.value)} />
      </div>
      <div>
        <label>Contains Gluten:</label>
        <input
          type="checkbox"
          checked={containsGluten}
          onChange={(e) => setContainsGluten(e.target.checked)}
        />
      </div>
      <div>
        <label>Categories:</label>
        {Array.isArray(availableCategories) &&
          availableCategories.map((category) => (
            <div key={category.id}>
              <input
                type="checkbox"
                checked={categories.some((cat) => cat.id === category.id)}
                onChange={() => handleCategoryToggle(category)}
              />
              {category.name}
            </div>
          ))}
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default AddRecipe;
