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

    @Transactional(readOnly = true)
    public List<Recipe> getTopRatedRecipes(int topN) {
        log.debug("Fetching top {} rated recipes.", topN);
        Pageable pageable = PageRequest.of(0, topN);
        List<Recipe> topRecipes = ratingRepository.findTopRatedRecipes(pageable);
        log.info("Retrieved {} top-rated recipes.", topRecipes.size());
        return topRecipes;
    }

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
