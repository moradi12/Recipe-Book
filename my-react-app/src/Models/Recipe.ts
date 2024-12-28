import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

// Models/Recipe.ts
export interface Recipe {
  id: number;
  name: string; // Added to match the `name` field in the Java class
  title: string;
  description: string;
  ingredients: { id: number; name: string; quantity: string; unit: string }[];
  foodCategory: string; 
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: string; // Matches `RecipeStatus` in Java class, assuming it's a string enum on the client
  createdAt: string; // LocalDateTime should be represented as ISO string in TypeScript
  updatedAt: string; // LocalDateTime as ISO string
  createdBy: User; // Matches `User createdBy` in Java class
  categories: Category[]; 

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
  id: number;
  name: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  categories: Category[];
}






export interface APIRecipeResponse {
  id: number;
  title: string;
  description: string;
  ingredients: { id: string; name: string; quantity: string }[];
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