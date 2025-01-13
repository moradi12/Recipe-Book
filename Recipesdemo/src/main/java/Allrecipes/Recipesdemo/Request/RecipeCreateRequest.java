package Allrecipes.Recipesdemo.Request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeCreateRequest {

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotEmpty(message = "Ingredients cannot be empty")
    private List<IngredientRequest> ingredients;

    @NotBlank(message = "Preparation steps are mandatory")
    private String preparationSteps;

    @Positive(message = "Cooking time must be positive")
    private int cookingTime;

    @Positive(message = "Servings must be positive")
    private int servings;

    private String dietaryInfo;

    private Boolean containsGluten;

    // Holds category IDs from the frontend
    private Set<Long> categoryIds;

    // Base64-encoded photo
    private String photo;

    // If 'containsGluten' is null, default to true
    public boolean getContainsGlutenOrDefault() {
        return Boolean.TRUE.equals(containsGluten);
    }
}
