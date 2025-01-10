import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import { RecipeResponse } from "../../Models/Recipe";
import RecipeService, { PaginatedRecipes } from "../../Service/RecipeService";
import { checkData } from "../../Utiles/checkData";
import { notify } from "../../Utiles/notif";
import { recipeSystem } from "../Redux/store";
import "./GetAllRecipes.css";

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  }, []);

  // 2) Fetch categories (for <select>).
  const fetchCategories = useCallback(async () => {
    try {
      const response = await RecipeService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      notify.error("Failed to load categories.");
      console.error("Error fetching categories:", err);
    }
  }, []);

  // 3) Fetch recipes with pagination (and optional category filter).
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const categoryParam = filterCategory || undefined;

      const response = await RecipeService.getAllRecipesPaginated(
        pagination.page,
        pagination.size,
        categoryParam
      );
      const data: PaginatedRecipes = response.data;

      setRecipes(data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (err: unknown) {
      let errorMessage = "Failed to load recipes.";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
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

      if (!token || token.length < 10) {
        notify.error("Missing authorization token. Please log in again.");
        return;
      }

      if (window.confirm("Are you sure you want to delete this recipe?")) {
        try {
          await RecipeService.deleteRecipe(id, token);
          notify.success("Recipe deleted successfully!");
          fetchRecipes();
        } catch (err: unknown) {
          let errorMessage = "An unexpected error occurred.";
          if (err instanceof Error) {
            errorMessage = err.message || errorMessage;
          }
          notify.error(errorMessage);
          console.error("Error deleting recipe:", err);
        }
      }
    },
    [fetchRecipes]
  );

  // On mount, fetch categories once
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Whenever pagination or filter changes, refetch recipes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  /**
   * Render the list of recipes.
   */
  const renderRecipeList = () => {
    if (!recipes.length && !loading) {
      return <p>No recipes found.</p>;
    }

    return (
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="recipe-item">
            <h3>{recipe.title || "No Title"}</h3>
            <p>
              <strong>Description:</strong>{" "}
              {recipe.description || "No Description"}
            </p>
            <p>
              <strong>Preparation Steps:</strong>{" "}
              {recipe.preparationSteps || "None"}
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
              <strong>Contains Gluten:</strong>{" "}
              {recipe.containsGluten ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong> {recipe.status || "Unknown"}
            </p>

            {/* ===== Display categories if present ===== */}
            {recipe.categories && recipe.categories.length > 0 && (
              <p>
                <strong>Categories:</strong>{" "}
                {recipe.categories
                  .map((cat) => (typeof cat === "string" ? cat : cat.name))
                  .join(", ")}
              </p>
            )}

            {/* Display createdBy */}
            <p>
              <strong>Created By:</strong> {recipe.createdByUsername || "Unknown"}            </p>
            {/* ===== Display photo if base64 field ===== */}
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
            {recipe.ingredients?.length ? (
              <ul>
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients listed</p>
            )}

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
   * Render pagination controls
   */
  const renderPagination = () => (
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

  return (
    <div className="get-all-recipes">
      <h2>
        All Recipes{" "}
        {pagination.totalPages > 0 &&
          `(Page ${pagination.page + 1} of ${pagination.totalPages})`}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Filter by Category */}
      <div className="filter-container">
        <label htmlFor="category-filter">Filter by Category:</label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          disabled={loading}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Render recipes */}
      {renderRecipeList()}

      {/* Pagination controls */}
      {recipes.length > 0 && renderPagination()}
    </div>
  );
};

export default GetAllRecipes;
