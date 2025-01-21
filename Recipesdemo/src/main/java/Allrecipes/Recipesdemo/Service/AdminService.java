package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final RecipeRepository recipeRepository;
    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Transactional(readOnly = true)
    public List<Recipe> getPendingRecipes() {
        logger.debug("Fetching all pending recipes.");
        return recipeRepository.findByStatus(RecipeStatus.PENDING_APPROVAL); // Using enum constant directly
    }

    @Transactional
    public void approveRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Recipe not found with ID: {}", id);
                    return new RecipeNotFoundException("Recipe with ID " + id + " not found.");
                });
        recipe.setStatus(RecipeStatus.APPROVED); // Using enum constant directly
        recipeRepository.save(recipe);
        logger.info("Recipe with ID {} approved.", id);
    }


    @Transactional
    public void rejectRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Recipe not found with ID: {}", id);
                    return new RecipeNotFoundException("Recipe with ID " + id + " not found.");
                });
        recipe.setStatus(RecipeStatus.REJECTED); // Using enum constant directly
        recipeRepository.save(recipe);
        logger.info("Recipe with ID {} rejected.", id);
    }
}
