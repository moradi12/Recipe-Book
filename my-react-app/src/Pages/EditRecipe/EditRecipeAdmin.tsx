// src/Pages/EditRecipeAdmin/EditRecipeAdmin.tsx
import "./EditRecipe.css";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../Models/Category";
import { IngredientRequest, RecipeCreateRequest } from "../../Models/RecipeCreateRequest";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";

const EditRecipeAdmin: React.FC = () => {
  const { id } = useParams(); // /admin/edit-recipe/:id
  const navigate = useNavigate();

  // Grab token from Redux store or some global store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useSelector((state: any) => state.auth);
  const token = auth?.token || "";

  // Local state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // This is the data structure matching RecipeCreateRequest
  const [recipeData, setRecipeData] = useState<RecipeCreateRequest>({
    title: "",
    description: "",
    cookingTime: 0,
    servings: 0,
    ingredients: [],
    preparationSteps: "",
    dietaryInfo: "",
    containsGluten: true, // default
    categoryIds: [],
    photo: "", // if you want to handle base64
  });

  // ================================
  // 1) Fetch existing recipe
  // ================================
  const fetchRecipe = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await RecipeService.getRecipeById(Number(id));
      const existing: RecipeResponse = response.data;

      // Map existing recipe -> RecipeCreateRequest
      // "existing.ingredients" is an array of strings. 
      // The back-end expects an array of {name, quantity, unit} objects
      // So we might parse them or force user to re-enter them.
      // For demonstration, let's assume the string is like "2 cups of sugar"
      const mappedIngredients: IngredientRequest[] = existing.ingredients.map((str) => {
        // simplistic parsing
        // e.g. "2 cups of sugar"
        // or "1 piece of onion"
        const parts = str.split(" of ");
        if (parts.length === 2) {
          // e.g. "2 cups" and "sugar"
          const [quantity, unit] = parts[0].split(" ");
          return {
            name: parts[1].trim(),
            quantity: quantity || "1",
            unit: unit || "unit",
          };
        }
        // fallback if we can't parse
        return {
          name: str.trim(),
          quantity: "1",
          unit: "unit",
        };
      });

      // We also have category names in existing.categories (like ["Dessert","Vegan"])
      // But back-end expects numeric IDs in categoryIds. We must look them up or let user select anew.
      // For simplicity, let's start with an empty array and let user re-select categories:
      // If you want to map back to IDs, you'd need a known list of categories first.

      const createReq: RecipeCreateRequest = {
        title: existing.title || "",
        description: existing.description || "",
        cookingTime: existing.cookingTime || 0,
        servings: existing.servings || 0,
        ingredients: mappedIngredients,
        preparationSteps: existing.preparationSteps || "",
        dietaryInfo: existing.dietaryInfo || "",
        containsGluten: existing.containsGluten,
        categoryIds: [],
        photo: existing.photo || "", // base64 if present
      };

      setRecipeData(createReq);
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to load recipe for editing.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ================================
  // 2) Fetch categories
  // ================================
  const fetchCategories = useCallback(async () => {
    try {
      const catResponse = await RecipeService.getAllCategories();
      setAllCategories(catResponse.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Not a showstopper
    }
  }, []);

  // On mount (or id change), fetch data
  useEffect(() => {
    fetchRecipe();
    fetchCategories();
  }, [fetchRecipe, fetchCategories]);

  // ================================
  // Handlers
  // ================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof RecipeCreateRequest, value: any) => {
    setRecipeData((prev) => ({ ...prev, [field]: value }));
  };

  // We'll store ingredients as IngredientRequest objects
  const handleIngredientsTextChange = (value: string) => {
    // Suppose user enters multiline text:
    // each line => "quantity unit of name"
    const lines = value.split("\n");
    const newIngredients: IngredientRequest[] = lines.map((line) => {
      const parts = line.split(" of ");
      if (parts.length === 2) {
        // e.g. "2 cups" and "sugar"
        const [quantity, unit] = parts[0].split(" ");
        return {
          name: parts[1].trim(),
          quantity: quantity || "1",
          unit: unit || "unit",
        };
      }
      return {
        name: line.trim(),
        quantity: "1",
        unit: "unit",
      };
    });
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleToggleCategory = (catId: number) => {
    setRecipeData((prev) => {
      const { categoryIds } = prev;
      if (categoryIds.includes(catId)) {
        // remove
        return { ...prev, categoryIds: categoryIds.filter((c) => c !== catId) };
      } else {
        // add
        return { ...prev, categoryIds: [...categoryIds, catId] };
      }
    });
  };

  // ================================
  // Submit => PUT /api/admin/recipes/{id}
  // ================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      notify.error("No recipe ID in the URL!");
      return;
    }
    if (!token) {
      notify.error("Missing auth token. Please log in.");
      return;
    }

    try {
      setLoading(true);
      // Use the new method that calls the admin endpoint
      const response = await RecipeService.updateRecipeAsAdmin(
        Number(id),
        recipeData,
        token
      );
      console.log("Admin update response:", response.data);
      notify.success("Recipe updated successfully!");
      navigate("/"); // or wherever you'd like
    } catch (err) {
      console.error("Error updating recipe (admin):", err);
      notify.error("Failed to update recipe.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !recipeData.title) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Convert the IngredientRequest[] to multiline text
  const ingredientsText = recipeData.ingredients
    .map((ing) => `${ing.quantity} ${ing.unit} of ${ing.name}`)
    .join("\n");

  return (
    <div style={{ padding: 16 }}>
      <h2>Edit Recipe (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
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
            value={recipeData.dietaryInfo}
            onChange={(e) => handleChange("dietaryInfo", e.target.value)}
          />
        </div>

        <div>
          <label>Contains Gluten:</label>
          <input
            type="checkbox"
            checked={!!recipeData.containsGluten}
            onChange={(e) => handleChange("containsGluten", e.target.checked)}
          />
        </div>

        <div>
          <label>Ingredients (one per line: "2 cups of sugar"):</label>
          <textarea
            rows={5}
            value={ingredientsText}
            onChange={(e) => handleIngredientsTextChange(e.target.value)}
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
          <div style={{ display: "flex", flexDirection: "column" }}>
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

        {/* If you want to handle photo as base64 input: */}
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
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipeAdmin;
