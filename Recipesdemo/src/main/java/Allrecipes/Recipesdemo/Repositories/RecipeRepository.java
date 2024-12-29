package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByStatus(RecipeStatus status);

    List<Recipe> findByCreatedById(Long userId);

    List<Recipe> findByTitleContainingIgnoreCase(String title);
    @Query("SELECT r FROM Recipe r JOIN FETCH r.categories WHERE r.id = :id")
    Optional<Recipe> findByIdWithCategories(@Param("id") Long id);
    Page<Recipe> findById(Long id, Pageable pageable);
}
