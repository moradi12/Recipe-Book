package Allrecipes.Recipesdemo.Mappers;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Entities.RecipeReview;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Response.RecipeReviewResponse;

import java.util.List;

public class RecipeMapper {

    public static RecipeResponse toRecipeResponse(Recipe recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .ingredients(mapIngredientsToStrings(recipe.getIngredients())) // Update here
                .preparationSteps(recipe.getPreparationSteps())
                .cookingTime(recipe.getCookingTime())
                .servings(recipe.getServings())
                .dietaryInfo(recipe.getDietaryInfo())
                .status(recipe.getStatus().name())
                .createdByUsername(recipe.getCreatedBy().getUsername())
                .build();
    }

    public static RecipeReviewResponse toRecipeReviewResponse(RecipeReview review) {
        return RecipeReviewResponse.builder()
                .id(review.getId())
                .score(review.getScore())
                .comment(review.getComment())
                .recipeId(review.getRecipe().getId())
                .userId(review.getUser().getId())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private static List<String> mapIngredientsToStrings(List<Ingredient> ingredients) {
        return ingredients.stream()
                .map(ingredient -> ingredient.getQuantity() + " " + ingredient.getUnit() + " of " + ingredient.getName())
                .toList();
    }
}
