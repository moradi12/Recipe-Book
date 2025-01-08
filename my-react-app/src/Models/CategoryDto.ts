interface CategoryDto {
    id: number;
    name: string;
  }
  
  export interface RecipeResponse {
    // ...
    categories?: CategoryDto[]; 
  }
  