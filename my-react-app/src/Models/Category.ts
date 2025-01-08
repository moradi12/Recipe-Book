import { FoodCategory } from "./FoodCategory";

// Models/Category.ts
export interface Category {
    id: number;
    name: string; // Unique name for the category
    foodCategory?: FoodCategory; // Enum type to match backend
    description?: string;
  }
  