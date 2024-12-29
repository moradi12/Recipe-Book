package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Repositories.RatingRepository;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingStatisticsService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;

    /**
     * Retrieves the top N rated recipes based on average scores.
     *
     * @param topN The number of top-rated recipes to retrieve.
     * @return A list of top-rated Recipe entities.
     */
    @Transactional(readOnly = true)
    public List<Recipe> getTopRatedRecipes(int topN) {
        log.debug("Fetching top {} rated recipes.", topN);
        Pageable pageable = PageRequest.of(0, topN);
        List<Recipe> topRecipes = ratingRepository.findTopRatedRecipes(pageable);
        log.info("Retrieved {} top-rated recipes.", topRecipes.size());
        return topRecipes;
    }

    /**
     * Retrieves the total number of ratings for a specific recipe.
     *
     * @param recipeId The ID of the recipe.
     * @return The total number of ratings.
     * @throws ResourceNotFoundException If the recipe does not exist.
     */
    @Transactional(readOnly = true)
    public long getTotalRatingsForRecipe(Long recipeId) {
        log.debug("Counting total ratings for Recipe ID: {}", recipeId);
        if (!recipeRepository.existsById(recipeId)) {
            log.error("Recipe not found with id: {}", recipeId);
            throw new ResourceNotFoundException("Recipe not found with id: " + recipeId);
        }
        long count = ratingRepository.countByRecipeId(recipeId);
        log.info("Total ratings for Recipe ID {}: {}", recipeId, count);
        return count;
    }
}
