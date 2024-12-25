// Models/RecipeCreateRequest.ts

export interface IngredientRequest {
    name: string;
    quantity: string;
    unit: string;
}

export interface RecipeCreateRequest {
    title: string;
    description: string;
    ingredients: IngredientRequest[];
    preparationSteps: string;
    cookingTime: number;
    servings: number;
    dietaryInfo?: string;
    containsGluten: boolean;
    // categoryId has been removed
}
