package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Entities.Rating;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Rating findByUserAndRecipe(User user, Recipe recipe);

    // Calculate the average score for a specific recipe
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.recipe.id = :recipeId AND r.deleted = false")
    Double findAverageRatingByRecipe(Long recipeId);

    // Fetch all ratings for a recipe with pagination
    Page<Rating> findByRecipe_Id(Long recipeId, Pageable pageable);

    List<Rating> findByRecipe_Id(Long recipeId);

    boolean existsByRecipeIdAndUserId(Long recipeId, Long userId);

    // Fetch all active ratings
    @Query("SELECT r FROM Rating r WHERE r.deleted = false")
    List<Rating> findAllActive();

    // Fetch active ratings for a recipe with pagination
    Page<Rating> findByRecipe_IdAndDeletedFalse(Long recipeId, Pageable pageable);

    // Fetch active ratings by a specific user with pagination
    Page<Rating> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);
}
