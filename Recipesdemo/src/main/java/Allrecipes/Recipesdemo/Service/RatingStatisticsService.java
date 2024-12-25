package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Repositories.RatingRepository;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingStatisticsService {

    private final RatingRepository ratingRepository;
    private final RecipeRepository recipeRepository;

    private void validateRecipeExists(Long recipeId) {
        if (!recipeRepository.existsById(recipeId)) {
            throw new ResourceNotFoundException("Recipe not found with id: " + recipeId);
        }
    }
}
