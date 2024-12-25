package Allrecipes.Recipesdemo.Service;
import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Repositories.IngredientsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredientService {

    @Autowired
    private IngredientsRepo ingredientsRepo;

    public Ingredient addIngredient(Ingredient ingredient) {
        return ingredientsRepo.save(ingredient);
    }

    public void deleteIngredient(Long id) {
        if (!ingredientsRepo.existsById(id)) {
            throw new IllegalArgumentException("Ingredient not found with id: " + id);
        }
        ingredientsRepo.deleteById(id);
    }

    public List<Ingredient> getAllIngredients() {
        return ingredientsRepo.findAll();
    }
}
