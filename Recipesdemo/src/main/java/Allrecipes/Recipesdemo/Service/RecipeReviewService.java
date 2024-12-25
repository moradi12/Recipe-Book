package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.RecipeReview;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.InvalidRecipeDataException;
import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Repositories.RecipeReviewRepository;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import Allrecipes.Recipesdemo.Request.RecipeReviewRequest;
import Allrecipes.Recipesdemo.Response.RecipeReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RecipeReviewService {

    private final RecipeReviewRepository recipeReviewRepository;
    private final RecipeRepository recipeRepository;

    public RecipeReviewService(RecipeReviewRepository recipeReviewRepository,
                               RecipeRepository recipeRepository) {
        this.recipeReviewRepository = recipeReviewRepository;
        this.recipeRepository = recipeRepository;
    }

    public RecipeReview addReview(RecipeReviewRequest request, User user) {
        Recipe recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with ID: " + request.getRecipeId()));

        RecipeReview existingReview = recipeReviewRepository.findByRecipeIdAndUserId(recipe.getId(), user.getId());
        if (existingReview != null) {
            throw new InvalidRecipeDataException("User has already reviewed this recipe");
        }

        if (request.getScore() < 1 || request.getScore() > 5) {
            throw new InvalidRecipeDataException("Score must be between 1 and 5");
        }

        RecipeReview review = RecipeReview.builder()
                .score(request.getScore())
                .comment(request.getComment())
                .recipe(recipe)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        return recipeReviewRepository.save(review);
    }

    public Page<RecipeReviewResponse> getReviewsByRecipeId(Long recipeId, Pageable pageable) {
        Page<RecipeReview> reviews = recipeReviewRepository.findByRecipeId(recipeId, pageable);
        return reviews.map(this::toRecipeReviewResponse);
    }

    public void deleteReview(Long reviewId, User user) {
        RecipeReview review = recipeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RecipeNotFoundException("Review not found with ID: " + reviewId));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new InvalidRecipeDataException("You are not authorized to delete this review");
        }

        recipeReviewRepository.delete(review);
    }
    public RecipeReviewResponse toRecipeReviewResponse(RecipeReview review) {
        return RecipeReviewResponse.builder()
                .id(review.getId())
                .score(review.getScore())
                .comment(review.getComment())
                .recipeId(review.getRecipe().getId())
                .userId(review.getUser().getId())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
