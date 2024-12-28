package Allrecipes.Recipesdemo.Response;

import Allrecipes.Recipesdemo.DTOs.IngredientDto;

import java.util.List;

public class RecipeResponse {
    private Long id;
    private String title;
    private String description;
    private List<IngredientDto> ingredients; // Updated to use IngredientDto    private String preparationSteps;
    private int cookingTime;
    private int servings;
    private String dietaryInfo;
    private String status;
    private String createdByUsername;

    // Getters and Setters
}
