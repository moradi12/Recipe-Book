package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Entities.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    Optional<Favorite> findByUserIdAndRecipeId(Long userId, Long recipeId);

    List<Favorite> findByUserId(Long userId);
}
