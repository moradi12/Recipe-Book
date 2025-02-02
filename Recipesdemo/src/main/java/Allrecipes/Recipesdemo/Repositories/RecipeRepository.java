package Allrecipes.Recipesdemo.Repositories;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Blob;
import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByStatus(RecipeStatus status);

    List<Recipe> findByCreatedById(Long userId);

    List<Recipe> findByTitleContainingIgnoreCase(String title);
    @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.categories WHERE r.id = :id")
    Optional<Recipe> findByIdWithCategories(@Param("id") Long id);
    Page<Recipe> findById(Long id, Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE r.photo IS NOT NULL")
    List<Recipe> findRecipesWithPhotos();

    @Modifying
    @Query("UPDATE Recipe r SET r.photo = :photo WHERE r.id = :id")
    void updatePhoto(@Param("id") Long id, @Param("photo") Blob photo);


    @Query("SELECT r FROM Recipe r JOIN r.categories c WHERE c.id = :categoryId")
    Page<Recipe> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
}
