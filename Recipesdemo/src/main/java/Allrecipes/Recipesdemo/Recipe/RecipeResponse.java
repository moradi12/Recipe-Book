package Allrecipes.Recipesdemo.Recipe;

import lombok.Builder;
import lombok.Data;

import java.util.Base64;
import java.util.List;

@Data
@Builder
public class RecipeResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> ingredients;
    private String preparationSteps;
    private int cookingTime;
    private int servings;
    private String dietaryInfo;
    private String status;
    private String createdByUsername;
    private String photo;
    private List<String> categories;

    // Default constructor
    public RecipeResponse() {
    }

    // Constructor with all fields including categories
    public RecipeResponse(Long id, String title, String description, List<String> ingredients, String preparationSteps, int cookingTime, int servings, String dietaryInfo, String status, String createdByUsername, String photo, List<String> categories) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.preparationSteps = preparationSteps;
        this.cookingTime = cookingTime;
        this.servings = servings;
        this.dietaryInfo = dietaryInfo;
        this.status = status;
        this.createdByUsername = createdByUsername;
        this.photo = photo;
        this.categories = categories;
    }

    // Constructor with photo as Base64 string and categories
    public RecipeResponse(Long id, String title, String description, List<String> ingredients, String preparationSteps, int cookingTime, int servings, String dietaryInfo, String status, String createdByUsername, byte[] photoBytes, List<String> categories) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.preparationSteps = preparationSteps;
        this.cookingTime = cookingTime;
        this.servings = servings;
        this.dietaryInfo = dietaryInfo;
        this.status = status;
        this.createdByUsername = createdByUsername;
        this.photo = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
        this.categories = categories;
    }
}
