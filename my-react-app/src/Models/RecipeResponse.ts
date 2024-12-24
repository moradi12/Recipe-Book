export interface RecipeResponse {
    id: number;
    name: string; // Required
    title: string;
    description: string;
    ingredients: string[];
    preparationSteps: string;
    cookingTime: number;
    servings: number;
    dietaryInfo?: string;
    containsGluten: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdByUsername: string;
    categories: { id: number; name: string }[];
}
