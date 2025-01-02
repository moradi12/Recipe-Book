import React, { useEffect, useState } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Ensure JWT token is valid at the top
  useEffect(() => {
    checkData();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await RecipeService.getAllRecipesPaginated(
        pagination.page,
        pagination.size,
        filterCategory
      );
      const data: PaginatedRecipes = response.data;
      setRecipes(data.content);
      setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to load recipes.";
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: number) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          notify.error(`Failed to delete recipe: ${error.response.data.message}`);
        } else {
          console.error("Error deleting recipe:", error.message);
          notify.error("An unexpected error occurred.");
        }
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [pagination.page, pagination.size, filterCategory]);

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
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

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

      <div className="pagination">
        <button
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          disabled={pagination.page === 0}
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
          disabled={pagination.page >= pagination.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetAllRecipes;
