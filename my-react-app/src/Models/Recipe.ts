// Models/Recipe.ts
export interface Recipe {
  id: number;
  name: string; // Added to match the `name` field in the Java class
  title: string;
  description: string;
  ingredients: string[]; // Matches `List<String> ingredients` from Java class
  preparationSteps: string;
  cookingTime: number;
  servings: number;
  dietaryInfo?: string;
  containsGluten: boolean;
  status: string; // Matches `RecipeStatus` in Java class, assuming it's a string enum on the client
  createdAt: string; // LocalDateTime should be represented as ISO string in TypeScript
  updatedAt: string; // LocalDateTime as ISO string
  createdBy: User; // Matches `User createdBy` in Java class
  categories: Category[]; // Matches `Set<Category> categories` in Java class
}

export interface RecipeResponse extends Recipe {
  createdByUsername: string; // Specific to the response, added for convenience
}

// Models/User.ts
export interface User {
  id: number;
  username: string; // Assuming you have a username field for `User`
  email: string; // Assuming an email field exists
  // Add more fields if necessary
}

// Models/Category.ts
export interface Category {
  id: number;
  name: string; // Assuming categories have an ID and name
}
