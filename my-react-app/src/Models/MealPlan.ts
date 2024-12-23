export interface MealPlan {
    id: string;
    userId: string;
    name: string;
    recipes: string[]; // Array of recipe IDs
    startDate: Date;
    endDate: Date;
  }
  