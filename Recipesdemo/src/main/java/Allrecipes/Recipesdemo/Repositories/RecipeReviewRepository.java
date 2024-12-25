package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Entities.RecipeReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeReviewRepository extends JpaRepository<RecipeReview, Long> {

    Page<RecipeReview> findByRecipeId(Long recipeId, Pageable pageable);

    RecipeReview findByRecipeIdAndUserId(Long recipeId, Long userId);
}
