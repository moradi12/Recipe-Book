// Models/Rating.ts
export interface Rating {
  id: number;
  recipeId: number;
  userId: number;
  score: number; // e.g., rating out of 5
  comment?: string; // Optional comment
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
