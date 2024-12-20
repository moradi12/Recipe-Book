// Models/Recipe.ts
export interface Recipe {
    id: number;
    title: string;
    description: string;
    image?: string;
    ingredients: string[]; // or a more complex type if needed
    instructions: string[];
  }
  