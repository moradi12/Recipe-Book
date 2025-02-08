export interface RecipeCreateRequest {
    title: string;
    description: string;
    cookingTime: number;
    servings: number;
    ingredients: string[];
    preparationSteps: string;
    dietaryInfo: string;
    containsGluten: boolean;
    categoryIds: number[];   
    photo?: string | null;
  }
  