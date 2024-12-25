import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecipeResponse } from '../../Models/Recipe';
import { getPaginatedRecipes } from '../../Utiles/api/recipes';
import './RecipeList.css';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await getPaginatedRecipes(page, 10, 'createdAt', 'asc');
        setRecipes(response.content);
        setTotalPages(response.totalPages);
        setError(null); // Clear any existing errors on success
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || 'Failed to fetch recipes');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page]);

  const handlePrevious = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(prev => prev + 1);
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="text-red-500 font-bold">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Recipes</h1>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Cooking Time</th>
            <th className="py-2 px-4 border-b">Servings</th>
            <th className="py-2 px-4 border-b">Created By</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Ingredients</th>
            <th className="py-2 px-4 border-b">Dietary Info</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <tr key={recipe.id} className="text-center">
                <td className="py-2 px-4 border-b">{recipe.name}</td>
                <td className="py-2 px-4 border-b">{recipe.title}</td>
                <td className="py-2 px-4 border-b">{recipe.description}</td>
                <td className="py-2 px-4 border-b">{recipe.cookingTime} mins</td>
                <td className="py-2 px-4 border-b">{recipe.servings}</td>
                <td className="py-2 px-4 border-b">{recipe.createdBy.username}</td>
                <td className="py-2 px-4 border-b">{recipe.status}</td>
                <td className="py-2 px-4 border-b">
                  {recipe.ingredients.map(ingredient => (
                    <div key={ingredient.id}>
                      {ingredient.name} - {ingredient.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b">{recipe.dietaryInfo || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/recipes/edit/${recipe.id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="py-4 text-center">
                No recipes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={page === 0}
          className={`px-4 py-2 mr-2 rounded ${page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 ml-2 rounded ${page >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipeList;
