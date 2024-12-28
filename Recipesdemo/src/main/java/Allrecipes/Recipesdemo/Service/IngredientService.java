package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.DTOs.IngredientDto;
import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Repositories.IngredientsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IngredientService {

    @Autowired
    private IngredientsRepo ingredientsRepo;

    public Ingredient addIngredient(Ingredient ingredient) {
        if (ingredient.getName() == null || ingredient.getName().isEmpty()) {
            throw new IllegalArgumentException("Ingredient name is mandatory");
        }
        if (ingredient.getQuantity() == null || ingredient.getQuantity().isEmpty()) {
            throw new IllegalArgumentException("Ingredient quantity is mandatory");
        }
        if (ingredient.getUnit() == null || ingredient.getUnit().isEmpty()) {
            throw new IllegalArgumentException("Ingredient unit is mandatory");
        }
        return ingredientsRepo.save(ingredient);
    }

    public void deleteIngredient(Long id) {
        if (!ingredientsRepo.existsById(id)) {
            throw new ResourceNotFoundException("Ingredient not found with id: " + id);
        }
        ingredientsRepo.deleteById(id);
    }

    public List<IngredientDto> getAllIngredients() {
        return ingredientsRepo.findAll().stream()
                .map(ingredient -> new IngredientDto(
                        ingredient.getId(),
                        ingredient.getName(),
                        ingredient.getQuantity(),
                        ingredient.getUnit()
                ))
                .collect(Collectors.toList());
    }

    public List<Ingredient> getIngredientsByRecipe(Long recipeId) {
        return ingredientsRepo.findByRecipe_Id(recipeId);
    }}
