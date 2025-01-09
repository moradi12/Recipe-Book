import { Category } from "./Category";
import { FoodCategory } from "./FoodCategory";
import { Ingredient } from "./Ingredient";
import { RecipeStatus } from "./RecipeStatus";

// Models/Recipe.ts
export interface Recipe {
  photo?: string;
  id: number;
  name: string; // Matches backend's Recipe.name
  title: string;
  description: string;
  ingredients: Ingredient[]; // Consistent with backend's Ingredient entity
  foodCategory: FoodCategory; // Enum for type safety
  preparationSteps: string;
  cookingTime: number; // In minutes
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: RecipeStatus; // Enum to reflect RecipeStatus
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: User; // User interface
  categories?: string[];  // Array of Category interfaces
  multiline?: boolean
}



// Models/User.ts
export interface User {
  id: number;
  username: string; // Assuming you have a username field for `User`
  email: string; // Assuming an email field exists
  // Add more fields if necessary
}

// Models/Category.ts

export interface RecipeResponse {
  message: string;
  id: number;
  name: string;
  title: string;
  categories?: Array<string | { id: number; name: string }>;
  description: string;
  ingredients: string[];
  
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  photo?: string;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  foodCategory: Category[];
}





export interface APIRecipeResponse {
  id: number;
  title: string;
  description: string;
  ingredients: { id: string; name: string; quantity: string }[]; // Detailed backend format
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: string; // Use an enum if consistent
  createdAt: string;
  updatedAt: string;
  createdByUsername: string; // Ensure this matches backend naming
  categories: { id: number; name: string }[]; // Consistent structure
}
