package Allrecipes.Recipesdemo.DTOs;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class RecipeDto {
    private Long id;
    private String name;
    private String title;
    private String description;
    private List<IngredientDto> ingredients; // Updated to use IngredientDto
    private String preparationSteps;

    @Positive(message = "Cooking time must be positive")
    private int cookingTime;

    @Positive(message = "Servings must be positive")
    private int servings;
    private String photo;
    private String dietaryInfo;
    private RecipeStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdByUserId;
    private boolean containsGluten;
    private Set<CategoryDto> categories;

    private Set<Long> categoryIds;
}
