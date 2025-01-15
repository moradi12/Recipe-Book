// src/Pages/GetAllRecipes/GetAllRecipes.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService, { PaginatedRecipes } from "../../Service/RecipeService";
import { checkData } from "../../Utiles/checkData";
import { notify } from "../../Utiles/notif";
import { recipeSystem } from "../Redux/store";
import "./GetAllRecipes.css";

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // explicitly typed as Category[]
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // 1) Ensure JWT token is valid
  useEffect(() => {
    checkData();
    console.log("Checked user authentication");
  }, []);

  // 2) Fetch categories (for the select dropdown)
  const fetchCategories = useCallback(async () => {
    try {
      const response = await RecipeService.getAllCategories();
      console.log("Fetched categories:", response.data);
      setCategories(response.data); // response.data must be an array of Category objects
    } catch (err) {
      notify.error("Failed to load categories.");
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Normalize recipes to ensure consistent category handling.
  // If recipe.categories is empty or undefined, set it to ["Uncategorized"]
  const normalizeRecipes = (recipes: RecipeResponse[]): RecipeResponse[] => {
    return recipes.map((recipe) => ({
      ...recipe,
      categories: recipe.categories && recipe.categories.length > 0
        ? recipe.categories
        : ["Uncategorized"],
    }));
  };
    // 3) Fetch recipes with pagination (and optional category filter)
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching recipes with pagination:", {
        page: pagination.page,
        size: pagination.size,
        category: filterCategory || "All",
      });

      const categoryParam = filterCategory || undefined;

      const response = await RecipeService.getAllRecipesPaginated(
        pagination.page,
        pagination.size,
        categoryParam
      );
      const data: PaginatedRecipes = response.data;

      const normalizedRecipes = normalizeRecipes(data.content);
      console.log("Normalized recipes:", normalizedRecipes);

      setRecipes(normalizedRecipes);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (err: unknown) {
      let errorMessage = "Failed to load recipes.";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      console.error("Error fetching recipes:", err);
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, filterCategory]);

  // 4) Delete a recipe by ID
  const handleDeleteRecipe = useCallback(
    async (id: number) => {
      const state = recipeSystem.getState();
      const token = state.auth.token;

      console.log("Attempting to delete recipe with ID:", id);

      if (!token || token.length < 10) {
        notify.error("Missing authorization token. Please log in again.");
        return;
      }

      if (window.confirm("Are you sure you want to delete this recipe?")) {
        try {
          await RecipeService.deleteRecipe(id, token);
          console.log("Recipe deleted successfully:", id);
          notify.success("Recipe deleted successfully!");
          fetchRecipes();
        } catch (err: unknown) {
          let errorMessage = "An unexpected error occurred.";
          if (err instanceof Error) {
            errorMessage = err.message || errorMessage;
          }
          console.error("Error deleting recipe:", err);
          notify.error(errorMessage);
        }
      }
    },
    [fetchRecipes]
  );

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch recipes when pagination or filter changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  /**
   * Render the list of recipes.
   */
  const renderRecipeList = () => {
    console.log("Rendering recipe list:", recipes);
    if (!recipes.length && !loading) {
      return <p>No recipes found.</p>;
    }

    return (
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <h3>{recipe.title || "No Title"}</h3>
            <p>
              <strong>Description:</strong> {recipe.description || "No Description"}
            </p>
           
            <p>
              <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
            </p>
            <p>
              <strong>Servings:</strong> {recipe.servings}
            </p>
            <p>
              <strong>Dietary Info:</strong> {recipe.dietaryInfo || "N/A"}
            </p>
            <p>
              <strong>Contains Gluten:</strong> {recipe.containsGluten ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong> {recipe.status || "Unknown"}
            </p>
            <p>
              <strong>Categories:</strong>{" "}
              {recipe.categories && recipe.categories.length > 0
                ? recipe.categories.join(", ")
                : "Uncategorized"}
            </p>
            <p>
              <strong>Preparation Steps:</strong> {recipe.preparationSteps || "None"}
            </p>
            <p>
              <strong>Created By:</strong> {recipe.createdByUsername || "Unknown"}
            </p>
            {recipe.photo && (
              <div className="photo-preview">
                <img
                  src={`data:image/png;base64,${recipe.photo}`}
                  alt="Recipe"
                  className="preview-image"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, idx) => (
                // If ingredients is a string array, render directly.
                // If not, adjust here accordingly.
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
            <button
              className="edit-button"
              onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };

  /**
   * Render pagination controls.
   */
  const renderPagination = () => {
    console.log("Rendering pagination controls:", pagination);
    return (
      <div className="pagination">
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          disabled={pagination.page === 0 || loading}
        >
          Previous
        </button>
        <span>
          Page {pagination.page + 1} of {pagination.totalPages}
        </span>
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          disabled={pagination.page >= pagination.totalPages - 1 || loading}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="get-all-recipes">
      <h2>
        All Recipes{" "}
        {pagination.totalPages > 0 &&
          `(Page ${pagination.page + 1} of ${pagination.totalPages})`}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          disabled={loading}
        >
          <option value="">All Categories</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {renderRecipeList()}
      {recipes.length > 0 && renderPagination()}
    </div>
  );
};

export default GetAllRecipes;
