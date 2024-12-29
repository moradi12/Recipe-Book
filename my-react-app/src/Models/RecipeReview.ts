// Models/RecipeReview.ts
export interface RecipeReview {
    id: number;
    recipeId: number;
    userId: number;
    content: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}
