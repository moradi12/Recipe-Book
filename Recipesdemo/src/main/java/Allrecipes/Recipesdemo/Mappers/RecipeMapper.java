package Allrecipes.Recipesdemo.Mappers;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Entities.RecipeReview;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Response.RecipeReviewResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

public class RecipeMapper {

    private static final Logger logger = LoggerFactory.getLogger(RecipeMapper.class);

    public static RecipeResponse toRecipeResponse(Recipe recipe) {
        if (recipe == null) {
            logger.error("Attempted to map a null Recipe object to RecipeResponse");
            throw new IllegalArgumentException("Recipe cannot be null");
        }
        logger.info("Mapping Recipe with ID: {}", recipe.getId());
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .ingredients(mapIngredientsToStrings(recipe.getIngredients()))
                .preparationSteps(recipe.getPreparationSteps())
                .cookingTime(recipe.getCookingTime())
                .servings(recipe.getServings())
                .dietaryInfo(recipe.getDietaryInfo())
                .status(recipe.getStatus() != null ? recipe.getStatus().name() : "Unknown")
                .createdByUsername(recipe.getCreatedBy() != null ? recipe.getCreatedBy().getUsername() : "Unknown")
                .build();
    }

    public static RecipeReviewResponse toRecipeReviewResponse(RecipeReview review) {
        if (review == null) {
            logger.error("Attempted to map a null RecipeReview object to RecipeReviewResponse");
            throw new IllegalArgumentException("RecipeReview cannot be null");
        }
        logger.info("Mapping RecipeReview with ID: {}", review.getId());
        return RecipeReviewResponse.builder()
                .id(review.getId())
                .score(review.getScore())
                .comment(review.getComment())
                .recipeId(review.getRecipe() != null ? review.getRecipe().getId() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .createdAt(review.getCreatedAt())
                .build();
    }

    private static List<String> mapIngredientsToStrings(List<Ingredient> ingredients) {
        if (ingredients == null || ingredients.isEmpty()) {
            return Collections.emptyList();
        }
        return ingredients.stream()
                .map(ingredient -> formatIngredient(ingredient))
                .toList();
    }

    private static String formatIngredient(Ingredient ingredient) {
        return String.format("%s %s of %s", ingredient.getQuantity(), ingredient.getUnit(), ingredient.getName());
    }
}
