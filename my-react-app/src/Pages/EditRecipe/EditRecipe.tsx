import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import {
  IngredientRequest,
  RecipeCreateRequest,
} from "../../Models/RecipeCreateRequest";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";

// Import the CSS
import "./EditRecipe.css";

const EditRecipe: React.FC = () => {
  const { id } = useParams(); // e.g. /edit-recipe/5
  const navigate = useNavigate();

  // Redux store for auth token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useSelector((state: any) => state.auth);
  const token = auth?.token || "";

  // Local states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const [recipeData, setRecipeData] = useState<RecipeCreateRequest>({
    title: "",
    description: "",
    cookingTime: 0,
    servings: 0,
    dietaryInfo: "",
    containsGluten: true,
    ingredients: [],
    preparationSteps: "",
    categoryIds: [],
    photo: "",
  });

  // 1) Fetch existing recipe
  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");

      // Reset to default to prevent stale data
      setRecipeData({
        title: "",
        description: "",
        cookingTime: 0,
        servings: 0,
        dietaryInfo: "",
        containsGluten: true,
        ingredients: [],
        preparationSteps: "",
        categoryIds: [],
        photo: "",
      });

      const response = await RecipeService.getRecipeById(Number(id));
      const existing: RecipeResponse = response.data;

      // Convert the existing RecipeResponse -> RecipeCreateRequest
      const parsedIngredients: IngredientRequest[] = existing.ingredients.map(
        (str) => {
          const parts = str.split(" of ");
          if (parts.length === 2) {
            const [qty, unit] = parts[0].split(" ");
            return {
              name: parts[1].trim(),
              quantity: qty || "1",
              unit: unit || "",
            };
          }
          return {
            name: str.trim(),
            quantity: "1",
            unit: "",
          };
        }
      );

      const createReq: RecipeCreateRequest = {
        title: existing.title,
        description: existing.description,
        cookingTime: existing.cookingTime,
        servings: existing.servings,
        dietaryInfo: existing.dietaryInfo || "",
        containsGluten: existing.containsGluten,
        ingredients: parsedIngredients,
        preparationSteps: existing.preparationSteps || "",
        categoryIds: [],
        photo: existing.photo || "",
      };

      setRecipeData(createReq);
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe for editing.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 2) Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await RecipeService.getAllCategories();
      setAllCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  }, []);

  useEffect(() => {
    fetchRecipe();
    fetchCategories();
  }, [fetchRecipe, fetchCategories, id]);

  // Handler for changing a field
  const handleChange = (field: keyof RecipeCreateRequest, value: unknown) => {
    setRecipeData((prev) => ({ ...prev, [field]: value }));
  };

  // Build text for the ingredients textarea
  const ingredientsText = recipeData.ingredients
    .map((ing) => `${ing.quantity} ${ing.unit} of ${ing.name}`)
    .join("\n");

  // Parse user-input text -> ingredients array
  const handleIngredientsText = (text: string) => {
    const lines = text.split("\n");
    const newIngredients: IngredientRequest[] = lines.map((line) => {
      const parts = line.split(" of ");
      if (parts.length === 2) {
        const [qty, unit] = parts[0].split(" ");
        return {
          name: parts[1].trim(),
          quantity: qty || "1",
          unit: unit || "",
        };
      }
      return { name: line.trim(), quantity: "1", unit: "" };
    });
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  // Toggle category
  const handleToggleCategory = (catId: number) => {
    setRecipeData((prev) => {
      const { categoryIds } = prev;
      if (categoryIds.includes(catId)) {
        return { ...prev, categoryIds: categoryIds.filter((c) => c !== catId) };
      }
      return { ...prev, categoryIds: [...categoryIds, catId] };
    });
  };

  // Submit => PUT /api/admin/recipes/{id}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      notify.error("No recipe ID in the URL!");
      return;
    }
    if (!token) {
      notify.error("Missing or invalid auth token.");
      return;
    }
    try {
      setLoading(true);
      const res = await RecipeService.updateRecipeAsAdmin(
        Number(id),
        recipeData,
        token
      );
      console.log("Update response:", res.data);
      notify.success("Recipe updated successfully!");
      navigate("/all/recipes");
    } catch (err) {
      console.error("Error updating recipe:", err);
      notify.error("Failed to update recipe.");
    } finally {
      setLoading(false);
    }
  };

  // Loading states
  if (loading && !recipeData.title && !error) {
    return <div>Loading recipe...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div className="edit-recipe-container">
      <h2>Edit Recipe</h2>
      {/* Show error if needed */}
      {error && <div className="error">{error}</div>}

      <form className="edit-recipe-form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={recipeData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            rows={3}
            value={recipeData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Cooking Time */}
        <div className="form-group">
          <label>Cooking Time (minutes):</label>
          <input
            type="number"
            value={recipeData.cookingTime}
            onChange={(e) =>
              handleChange("cookingTime", Number(e.target.value))
            }
          />
        </div>

        {/* Servings */}
        <div className="form-group">
          <label>Servings:</label>
          <input
            type="number"
            value={recipeData.servings}
            onChange={(e) => handleChange("servings", Number(e.target.value))}
          />
        </div>

        {/* Dietary Info */}
        <div className="form-group">
          <label>Dietary Info:</label>
          <input
            type="text"
            value={recipeData.dietaryInfo}
            onChange={(e) => handleChange("dietaryInfo", e.target.value)}
          />
        </div>

        {/* Contains Gluten */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={recipeData.containsGluten}
              onChange={(e) =>
                handleChange("containsGluten", e.target.checked)
              }
            />
            Contains Gluten
          </label>
        </div>

        {/* Ingredients */}
        <div className="form-group">
          <label>Ingredients (one per line):</label>
          <textarea
            rows={4}
            value={ingredientsText}
            onChange={(e) => handleIngredientsText(e.target.value)}
          />
        </div>

        {/* Preparation Steps */}
        <div className="form-group">
          <label>Preparation Steps:</label>
          <textarea
            rows={5}
            value={recipeData.preparationSteps}
            onChange={(e) =>
              handleChange("preparationSteps", e.target.value)
            }
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <label>Categories:</label>
          <div className="categories-container">
            {allCategories.map((cat) => (
              <label key={cat.id}>
                <input
                  type="checkbox"
                  checked={recipeData.categoryIds.includes(cat.id)}
                  onChange={() => handleToggleCategory(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
