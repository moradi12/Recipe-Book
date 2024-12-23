export interface Rating {
    id: string;
    recipeId: string;
    userId: string;
    score: number; // e.g., 1 to 5
    createdAt: Date;
  }
  