export interface RecipeResponse {
    id: number;
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
    photo?: string;
    categories: string[];
}
