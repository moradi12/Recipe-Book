// Models/Comment.ts
export interface Comment {
  id: number;
  recipeId: number;
  userId: number;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
