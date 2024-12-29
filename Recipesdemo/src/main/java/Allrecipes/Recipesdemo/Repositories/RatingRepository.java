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
    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.recipe.id = :recipeId AND r.deleted = false")
    Double findAverageRatingByRecipeId(Long recipeId);
    long countByRecipeId(Long recipeId);
    @Query("SELECT r FROM Rating r WHERE r.recipe.id = :recipeId AND r.deleted = false")
    Page<Rating> findByRecipe_IdAndDeletedFalse(Long recipeId, Pageable pageable);
    List<Rating> findByRecipe_Id(Long recipeId);
    boolean existsByRecipeIdAndUserId(Long recipeId, Long userId);
    @Query("SELECT r FROM Rating r WHERE r.deleted = false")
    List<Rating> findAllActive();


    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.deleted = false")
    Page<Rating> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);
    @Query("SELECT r.recipe FROM Rating r WHERE r.deleted = false GROUP BY r.recipe.id ORDER BY AVG(r.score) DESC")
    List<Recipe> findTopRatedRecipes(Pageable pageable);
    @Query("SELECT COUNT(r) > 0 FROM Rating r WHERE r.id = :ratingId AND r.user.id = :userId AND r.deleted = false")
    boolean isRatingOwner(Long ratingId, Long userId);
}
