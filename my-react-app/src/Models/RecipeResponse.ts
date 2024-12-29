// Models/RecipeResponse.ts
import { FoodCategory } from "./FoodCategory";
import { Ingredient } from "./Ingredient";
import { RecipeStatus } from "./RecipeStatus";

export interface RecipeResponse {
    id: number;
    name: string;
    title: string;
    description: string;
    ingredients: Ingredient[]; // Use Ingredient interface
    preparationSteps: string;
    cookingTime: number;
    servings: number;
    dietaryInfo?: string;
    containsGluten: boolean;
    status: RecipeStatus; // Use enum
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    createdByUsername: string; // Assuming backend provides username instead of full User object
    category: FoodCategory; // Added this field}
}