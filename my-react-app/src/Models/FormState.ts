// Models/FormState.ts
import { IngredientRequest } from "./RecipeCreateRequest";

export interface FormState {
    title: string;
    description: string;
    ingredients: IngredientRequest[];
    preparationSteps: string;
    cookingTime: number;
    servings: number;
    dietaryInfo?: string;
    containsGluten: boolean;
    categoryId?: number;
}
