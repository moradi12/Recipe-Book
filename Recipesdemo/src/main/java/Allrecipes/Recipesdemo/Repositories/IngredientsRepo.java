package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientsRepo extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByRecipe_Id(Long recipeId);
}
