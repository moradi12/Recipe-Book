package Allrecipes.Recipesdemo.Recipe;

import lombok.Builder;
import lombok.Data;

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
}
