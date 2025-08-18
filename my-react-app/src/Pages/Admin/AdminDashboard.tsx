// src/components/RecipeAdminDashboard.tsx
import React, { FormEvent, useEffect, useState } from 'react';
import { RecipeResponse } from '../../Models/Recipe';
import { RecipeCreateRequest } from '../../Models/RecipeCreateRequest';
import RecipeService, { PaginatedRecipes } from '../../Service/RecipeService';
import './RecipeAdminDashboard.css';

const RecipeAdminDashboard: React.FC = () => {
  // State for paginated recipes from getAllRecipesPaginated
  const [recipesPage, setRecipesPage] = useState<PaginatedRecipes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form state shared between update and search operations
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [preparationSteps, setPreparationSteps] = useState<string>('');
  const [cookingTime, setCookingTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(1);
  const [containsGluten, setContainsGluten] = useState<boolean>(false);
  const [categoryIds, setCategoryIds] = useState<string>(''); // comma-separated IDs
  // For update operations
  const [updateId, setUpdateId] = useState<number>(0);

  // Get the token from localStorage (adjust if needed)
  const token = localStorage.getItem('token') || '';

  // Fetch paginated recipes on component mount (page 0, size 10)
  const fetchRecipes = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response = await RecipeService.getAllRecipesPaginated(page, size);
      setRecipesPage(response.data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error fetching recipes');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Build a RecipeCreateRequest object from form state
  // This is used for updating recipes.
  const buildRecipeRequest = (): RecipeCreateRequest => {
    // Convert the comma-separated string to a number array.
    const categoryIdsArray = categoryIds
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number(s));

    return {
      title,
      description,
      ingredients: [], // For simplicity, empty ingredients array (extend as needed)
      preparationSteps,
      cookingTime,
      servings,
      containsGluten,
      categoryIds: categoryIdsArray,
      // photo and dietaryInfo are optional
    };
  };

  // Handler to update an existing recipe
  const handleUpdateRecipe = async (e: FormEvent) => {
    e.preventDefault();
    if (updateId <= 0) {
      alert('Please enter a valid recipe ID to update.');
      return;
    }
    try {
      const updatedRecipeRequest = buildRecipeRequest();
      // Note: The updateRecipe method in RecipeService.ts expects a RecipeResponse as the recipe parameter.
      // In a real application, you might have a separate update request type.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await RecipeService.updateRecipe(
        updateId,
        updatedRecipeRequest as unknown as RecipeResponse,
        token
      );
      alert(`Updated recipe ID ${updateId}.`);
      fetchRecipes();
      setUpdateId(0);
      setTitle('');
      setDescription('');
      setPreparationSteps('');
      setCookingTime(0);
      setServings(1);
      setContainsGluten(false);
      setCategoryIds('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error updating recipe.');
      }
    }
  };

  // Handler to approve a recipe
  const handleApproveRecipe = async (id: number) => {
    try {
      // Assume RecipeService.approveRecipe is implemented on the service side.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await RecipeService.approveRecipe(id, token);
      alert(`Approved recipe ID ${id}.`);
      fetchRecipes();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error approving recipe.');
      }
    }
  };

  // Handler to search for a recipe by title
  const handleSearchByTitle = async (titleQuery: string) => {
    try {
      const response = await RecipeService.searchRecipesByTitle(titleQuery);
      if (response.data.length === 0) {
        alert('No recipes found for that title.');
      } else {
        // For demonstration, we alert the title of the first found recipe.
        alert(`Found recipe: ${response.data[0].title}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error searching for recipes.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Recipe Admin Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      
      {/* Section: List Paginated Recipes */}
      <section className="dashboard-section">
        <h2>All Recipes (Paginated)</h2>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipesPage ? (
          <div>
            <p>
              Page {recipesPage.number + 1} of {recipesPage.totalPages} (showing {recipesPage.size} per page)
            </p>
            <ul className="recipe-list">
              {recipesPage.content.map((recipe) => (
                <li key={recipe.id}>
                  <span className="recipe-info">
                    <strong>{recipe.title}</strong> - {recipe.description}
                  </span>
                  <button
                    className="approve-button"
                    onClick={() => handleApproveRecipe(recipe.id)}
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No recipes found.</p>
        )}
      </section>

      {/* Section: Update Recipe */}
      <section className="dashboard-section">
        <h2>Update Recipe</h2>
        <form onSubmit={handleUpdateRecipe} className="dashboard-form">
          <label>
            Recipe ID to Update:
            <input
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(Number(e.target.value))}
              required
            />
          </label>
          <label>
            New Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            New Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            New Preparation Steps:
            <textarea
              value={preparationSteps}
              onChange={(e) => setPreparationSteps(e.target.value)}
              required
            />
          </label>
          <label>
            New Cooking Time (minutes):
            <input
              type="number"
              value={cookingTime}
              onChange={(e) => setCookingTime(Number(e.target.value))}
              required
            />
          </label>
          <label>
            New Servings:
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              required
            />
          </label>
          <label>
            Contains Gluten:
            <input
              type="checkbox"
              checked={containsGluten}
              onChange={(e) => setContainsGluten(e.target.checked)}
            />
            <span>Yes</span>
          </label>
          <label>
            Category IDs (comma-separated):
            <input
              type="text"
              value={categoryIds}
              onChange={(e) => setCategoryIds(e.target.value)}
              placeholder="e.g., 1,2,3"
            />
          </label>
          <button type="submit">Update Recipe</button>
        </form>
      </section>

      {/* Section: Search Recipe by Title */}
      <section className="dashboard-section">
        <h2>Search Recipe by Title</h2>
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const titleQuery = title.trim();
            if (titleQuery) {
              handleSearchByTitle(titleQuery);
            }
          }}
        >
          <input
            type="text"
            placeholder="Enter recipe title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>
    </div>
  );
};

export default RecipeAdminDashboard;
