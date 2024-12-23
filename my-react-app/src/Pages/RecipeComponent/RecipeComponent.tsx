import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeComponent.css'; // Import the CSS file
type Recipe = {
    id: number;
    title: string;
    description: string;
    ingredients: string;
    preparationSteps: string;
    cookingTime: number;
    servings: number;
    dietaryInfo: string;
    status: string;
    createdByUsername: string;
};

const RecipeComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Extract recipe ID from URL
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
            if (response.ok) {
                const data: Recipe = await response.json();
                setRecipe(data);
            } else {
                console.error("Failed to fetch recipe");
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    const formatCookingTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours} hrs ${remainingMinutes} mins` : `${remainingMinutes} mins`;
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="recipe">
            <h1>{recipe.title}</h1>
            <p><strong>Created By:</strong> {recipe.createdByUsername}</p>
            <p><strong>Description:</strong> {recipe.description}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Preparation Steps:</strong> {recipe.preparationSteps}</p>
            <p><strong>Cooking Time:</strong> {formatCookingTime(recipe.cookingTime)}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Dietary Info:</strong> {recipe.dietaryInfo}</p>
            <p><strong>Status:</strong> {recipe.status}</p>
        </div>
    );
};

export default RecipeComponent;
