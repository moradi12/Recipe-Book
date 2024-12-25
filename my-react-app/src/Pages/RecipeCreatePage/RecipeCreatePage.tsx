import axios from 'axios';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Ingredient } from '../../Models/Ingredient';

// Define the structure for the form inputs
interface RecipeCreateRequest {
  title: string;
  description: string;
  ingredients: Ingredient[];
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  categories: number[]; // Array of category IDs
}

const RecipeCreatePage: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RecipeCreateRequest>();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: '', recipeId: '', name: '', quantity: '' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

const onSubmit: SubmitHandler<RecipeCreateRequest> = async (data) => {
  try {
    const token = localStorage.getItem('token'); // Assumes the JWT token is stored in localStorage

    // Format the ingredients properly
    const formattedIngredients = ingredients.map((ingredient) => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.recipeId, // Assuming recipeId holds the unit (e.g., grams, liters, etc.)
    }));

    const formattedData = {
      ...data,
      ingredients: formattedIngredients,
    };

    const response = await axios.post(
      'http://localhost:8080/api/recipes',
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(`Recipe created successfully: ${response.data.title}`);
    reset();
    setIngredients([]); // Clear ingredients after submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating recipe:', error.response?.data || error.message);
    alert(`Failed to create the recipe: ${error.response?.data?.message || 'Unknown error'}`);
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Recipe</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            id="title"
            type="text"
            className="border rounded p-2 w-full"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            className="border rounded p-2 w-full"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="border rounded p-2 flex-1"
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                className="border rounded p-2 flex-1"
              />
              <select
                value={ingredient.recipeId}
                onChange={(e) => updateIngredient(index, 'recipeId', e.target.value)}
                className="border rounded p-2 flex-1"
              >
                <option value="">Select Unit</option>
                <option value="grams">Grams</option>
                <option value="milligrams">Milligrams</option>
                <option value="kilograms">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="milliliters">Milliliters</option>
                <option value="cups">Cups</option>
                <option value="tablespoons">Tablespoons</option>
                <option value="teaspoons">Teaspoons</option>
              </select>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label htmlFor="preparationSteps" className="block text-sm font-medium">Preparation Steps</label>
          <textarea
            id="preparationSteps"
            className="border rounded p-2 w-full"
            {...register('preparationSteps', { required: 'Preparation steps are required' })}
          />
          {errors.preparationSteps && <p className="text-red-500 text-sm">{errors.preparationSteps.message}</p>}
        </div>

        <div>
          <label htmlFor="cookingTime" className="block text-sm font-medium">Cooking Time (in minutes)</label>
          <input
            id="cookingTime"
            type="number"
            className="border rounded p-2 w-full"
            {...register('cookingTime', { required: 'Cooking time is required', valueAsNumber: true })}
          />
          {errors.cookingTime && <p className="text-red-500 text-sm">{errors.cookingTime.message}</p>}
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium">Servings</label>
          <input
            id="servings"
            type="number"
            className="border rounded p-2 w-full"
            {...register('servings', { required: 'Servings are required', valueAsNumber: true })}
          />
          {errors.servings && <p className="text-red-500 text-sm">{errors.servings.message}</p>}
        </div>

        <div>
          <label htmlFor="containsGluten" className="block text-sm font-medium">Contains Gluten</label>
          <input
            id="containsGluten"
            type="checkbox"
            className="border rounded p-2"
            {...register('containsGluten')}
          />
        </div>

        <div>
          <label htmlFor="categories" className="block text-sm font-medium">Categories (comma-separated IDs)</label>
          <input
            id="categories"
            type="text"
            className="border rounded p-2 w-full"
            {...register('categories', {
              required: 'Categories are required',
              setValueAs: (value) => value.split(',').map((id: string) => parseInt(id.trim())),
            })}
          />
          {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeCreatePage;
