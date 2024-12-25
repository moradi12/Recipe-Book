package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Entities.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientsRepo extends JpaRepository<Ingredient, Long> {
}
