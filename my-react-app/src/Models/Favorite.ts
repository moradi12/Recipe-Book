// Models/Favorite.ts
export interface Favorite {
  id: number;
  userId: number;
  recipeId: number;
  createdAt: string; // ISO date string
}
export interface FavoriteDTO {
  id: number;
  recipeId: number;
}
