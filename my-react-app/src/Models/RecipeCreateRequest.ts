// Models/RecipeCreateRequest.ts

export interface IngredientRequest {
    name: string;
    quantity: string; // e.g., "2 cups", "500g"
    unit: string; // e.g., "grams", "cups", "tablespoons"
}

export interface RecipeCreateRequest {
    title: string;
    description: string;
    ingredients: IngredientRequest[];
    preparationSteps: string;
    cookingTime: number; // In minutes
    servings: number;
    photo?: string; 
    dietaryInfo?: string;
    containsGluten: boolean;
    categories: number[]; // Array of category IDs if backend requires
    // Alternatively, use categories: Category[]; if backend expects full objects
}
