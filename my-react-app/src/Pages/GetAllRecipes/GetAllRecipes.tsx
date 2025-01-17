// src/Pages/GetAllRecipes/GetAllRecipes.tsx

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Category } from "../../Models/Category";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService, { PaginatedRecipes } from "../../Service/RecipeService";
import { checkData } from "../../Utiles/checkData";
import { notify } from "../../Utiles/notif";
import { recipeSystem } from "../Redux/store";
import CategoryFilter from "./CategoryFilter";
import "./GetAllRecipes.css";
import PaginationControls from "./PaginationControls";
import RecipeList from "./RecipeList";

const GetAllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useSelector((state: any) => state.auth); // Update the type as needed
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    checkData();
    console.log("Checked user authentication");
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await RecipeService.getAllCategories();
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (err) {
      notify.error("Failed to load categories.");
      console.error("Error fetching categories:", err);
    }
  }, []);

  const normalizeRecipes = (recipes: RecipeResponse[]): RecipeResponse[] => {
    return recipes.map((recipe) => ({
      ...recipe,
      categories:
        recipe.categories && recipe.categories.length > 0
          ? recipe.categories
          : ["Uncategorized"],
    }));
  };

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Convert the selected category (string) to a number, if set.
      const categoryParam = filterCategory ? Number(filterCategory) : undefined;

      console.log("Fetching recipes with:", {
        page: pagination.page,
        size: pagination.size,
        category: categoryParam || "All",
      });

      const response = await RecipeService.getAllRecipesPaginated(
        pagination.page,
        pagination.size,
        categoryParam
      );
      const data: PaginatedRecipes = response.data;
      const normalized = normalizeRecipes(data.content);

      setRecipes(normalized);
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

  // 5) Delete recipe
  const handleDeleteRecipe = useCallback(
    async (id: number) => {
      const state = recipeSystem.getState();
      const token = state.auth.token;

      if (!token || token.length < 10) {
        notify.error("Missing authorization token. Please log in again.");
        return;
      }

      if (auth.userType !== "ADMIN") {
        notify.error("Unauthorized: Only admins can delete recipes.");
        return;
      }

      if (window.confirm("Are you sure you want to delete this recipe?")) {
        try {
          await RecipeService.deleteRecipe(id, token);
          console.log("Recipe deleted successfully:", id);
          notify.success("Recipe deleted successfully!");
          fetchRecipes(); // Refresh the list
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
    [auth.userType, fetchRecipes]
  );

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch recipes whenever filter/pagination changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="get-all-recipes">
      <h2>
        All Recipes{" "}
        {pagination.totalPages > 0 &&
          `(Page ${pagination.page + 1} of ${pagination.totalPages})`}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        disabled={loading}
      />

      {/* Recipe List */}
      <RecipeList
        recipes={recipes}
        onDeleteRecipe={
          auth.userType === "ADMIN" ? handleDeleteRecipe : undefined
        }
        onEditRecipe={
          auth.userType === "ADMIN"
            ? (recipeId) => navigate(`/edit-recipe/${recipeId}`)
            : undefined
        }
      />

      {/* Pagination */}
      {recipes.length > 0 && (
        <PaginationControls
          pagination={pagination}
          setPagination={setPagination}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GetAllRecipes;
