// src/Pages/EditRecipe/EditRecipe.tsx

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

  // 1) Fetch existing recipe from /api/recipes/{id}
  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await RecipeService.getRecipeById(Number(id));
      const existing: RecipeResponse = response.data;

      // Convert the existing RecipeResponse -> RecipeCreateRequest
      // For ingredients, we have an array of strings (like "2 cups of sugar").
      // We'll parse them into { name, quantity, unit } objects:
      const parsedIngredients: IngredientRequest[] = existing.ingredients.map((str) => {
        const parts = str.split(" of ");
        if (parts.length === 2) {
          // e.g. "2 cups" and "sugar"
          const [qty, unit] = parts[0].split(" ");
          return {
            name: parts[1].trim(),
            quantity: qty || "1",
            unit: unit || "",
          };
        } else {
          return {
            name: str.trim(),
            quantity: "1",
            unit: "",
          };
        }
      });

      // For categories, you only have names in existing.categories;
      // your backend wants numeric IDs. We'll let user pick again, or
      // map them if you have a way to convert name -> ID.
      const createReq: RecipeCreateRequest = {
        title: existing.title,
        description: existing.description,
        cookingTime: existing.cookingTime,
        servings: existing.servings,
        dietaryInfo: existing.dietaryInfo || "",
        containsGluten: existing.containsGluten,
        ingredients: parsedIngredients,
        preparationSteps: existing.preparationSteps || "",
        categoryIds: [], // user can re-check categories in the form below
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

  // 2) Fetch categories for checkboxes
  const fetchCategories = useCallback(async () => {
    try {
      const res = await RecipeService.getAllCategories();
      setAllCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // On mount
  useEffect(() => {
    fetchRecipe();
    fetchCategories();
  }, [fetchRecipe, fetchCategories]);

  // Handler for changing a field
  const handleChange = (field: keyof RecipeCreateRequest, value: unknown) => {
    setRecipeData((prev) => ({ ...prev, [field]: value }));
  };

  // Convert IngredientRequest[] to multiline text
  const ingredientsText = recipeData.ingredients
    .map((ing) => `${ing.quantity} ${ing.unit} of ${ing.name}`)
    .join("\n");

  // Parse multiline text back into IngredientRequest[]
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
      } else {
        return { name: line.trim(), quantity: "1", unit: "" };
      }
    });
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  // Toggle category in recipeData.categoryIds
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
      const res = await RecipeService.updateRecipeAsAdmin(Number(id), recipeData, token);
      console.log("Update response:", res.data);
      notify.success("Recipe updated successfully!");
      navigate("/"); // or wherever you want to go
    } catch (err) {
      console.error("Error updating recipe:", err);
      notify.error("Failed to update recipe.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !recipeData.title) {
    return <div>Loading recipe...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={recipeData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            rows={3}
            value={recipeData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label>Cooking Time (minutes):</label>
          <input
            type="number"
            value={recipeData.cookingTime}
            onChange={(e) => handleChange("cookingTime", Number(e.target.value))}
          />
        </div>

        <div>
          <label>Servings:</label>
          <input
            type="number"
            value={recipeData.servings}
            onChange={(e) => handleChange("servings", Number(e.target.value))}
          />
        </div>

        <div>
          <label>Dietary Info:</label>
          <input
            type="text"
            value={recipeData.dietaryInfo}
            onChange={(e) => handleChange("dietaryInfo", e.target.value)}
          />
        </div>

        <div>
          <label>Contains Gluten:</label>
          <input
            type="checkbox"
            checked={recipeData.containsGluten}
            onChange={(e) => handleChange("containsGluten", e.target.checked)}
          />
        </div>

        <div>
          <label>Ingredients (one per line):</label>
          <textarea
            rows={4}
            value={ingredientsText}
            onChange={(e) => handleIngredientsText(e.target.value)}
          />
        </div>

        <div>
          <label>Preparation Steps:</label>
          <textarea
            rows={5}
            value={recipeData.preparationSteps}
            onChange={(e) => handleChange("preparationSteps", e.target.value)}
          />
        </div>

        {/* Category checkboxes */}
        <div>
          <label>Categories:</label>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {allCategories.map((cat) => (
              <label key={cat.id} style={{ marginRight: "1rem" }}>
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

        {/* Photo if your backend uses base64 */}
        {/* 
        <div>
          <label>Photo (Base64):</label>
          <textarea
            rows={3}
            value={recipeData.photo}
            onChange={(e) => handleChange("photo", e.target.value)}
          />
        </div>
        */}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
