package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.DTOs.IngredientDto;
import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Repositories.IngredientsRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class IngredientService {

    private final IngredientsRepo ingredientsRepo;

    @Transactional
    public Ingredient addIngredient(Ingredient ingredient) {
        log.debug("Adding new ingredient: {}", ingredient);

        if (ingredient.getName() == null || ingredient.getName().isEmpty()) {
            log.error("Ingredient name is missing.");
            throw new IllegalArgumentException("Ingredient name is mandatory");
        }
        if (ingredient.getQuantity() == null || ingredient.getQuantity().isEmpty()) {
            log.error("Ingredient quantity is missing.");
            throw new IllegalArgumentException("Ingredient quantity is mandatory");
        }
        if (ingredient.getUnit() == null || ingredient.getUnit().isEmpty()) {
            log.error("Ingredient unit is missing.");
            throw new IllegalArgumentException("Ingredient unit is mandatory");
        }

        Ingredient savedIngredient = ingredientsRepo.save(ingredient);
        log.info("Ingredient added with ID: {}", savedIngredient.getId());
        return savedIngredient;
    }

    @Transactional
    public void deleteIngredient(Long id) {
        log.debug("Attempting to delete ingredient with ID: {}", id);
        if (!ingredientsRepo.existsById(id)) {
            log.error("Ingredient not found with ID: {}", id);
            throw new ResourceNotFoundException("Ingredient not found with id: " + id);
        }
        ingredientsRepo.deleteById(id);
        log.info("Ingredient deleted with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<IngredientDto> getAllIngredients() {
        log.debug("Fetching all ingredients.");
        return ingredientsRepo.findAll().stream()
                .map(ingredient -> new IngredientDto(
                        ingredient.getId(),
                        ingredient.getName(),
                        ingredient.getQuantity(),
                        ingredient.getUnit()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Ingredient> getIngredientsByRecipe(Long recipeId) {
        log.debug("Fetching ingredients for recipe ID: {}", recipeId);
        return ingredientsRepo.findByRecipe_Id(recipeId);
    }
}
