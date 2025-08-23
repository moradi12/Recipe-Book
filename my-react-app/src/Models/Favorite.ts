// Based on backend Favorite entity
export interface Favorite {
  id: number;
  user: {
    id: number;
    userName: string;
  };
  recipe: {
    id: number;
    title: string;
  };
  favoritedAt: string; // ISO date string
}