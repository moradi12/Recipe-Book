package Allrecipes.Recipesdemo.Recipe;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Entities.RecipeReview;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // Control Lombok's equals and hashCode
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Only include 'id' in equals and hashCode
    private Long id;

    private String name;

    @Column(nullable = false)
    private String title;

    @Lob
    @JsonIgnore
    private Blob photo;


    @Lob
    private String description;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude // Exclude ingredients from toString to prevent LazyInitializationException
    private List<Ingredient> ingredients = new ArrayList<>();

    @Lob
    private String preparationSteps;

    @Positive
    private int cookingTime;

    @Min(1)
    private int servings;

    private String dietaryInfo;

    @Enumerated(EnumType.STRING)
    private RecipeStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @ToString.Exclude // Exclude user from toString to prevent LazyInitializationException
    private User createdBy;

    @Column(nullable = false)
    private boolean containsGluten = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "recipe_categories",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    @ToString.Exclude // Exclude categories from toString to prevent LazyInitializationException
    private Set<Category> categories = new HashSet<>();

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude // Exclude favorites from toString to prevent LazyInitializationException
    private Set<User> favorites = new HashSet<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude // Exclude recipeReviews from toString to prevent LazyInitializationException
    private Set<RecipeReview> recipeReviews = new HashSet<>();

    // Helper Methods to Manage Bidirectional Relationships
    public void addFavorite(User user) {
        this.favorites.add(user);
        user.getFavorites().add(this);
    }

    public void removeFavorite(User user) {
        this.favorites.remove(user);
        user.getFavorites().remove(this);
    }

    public void addCategory(Category category) {
        this.categories.add(category);
        category.getRecipes().add(this);
    }

    public void removeCategory(Category category) {
        this.categories.remove(category);
        category.getRecipes().remove(this);
    }

    public void addIngredient(Ingredient ingredient) {
        this.ingredients.add(ingredient);
        ingredient.setRecipe(this);
    }

    public void removeIngredient(Ingredient ingredient) {
        this.ingredients.remove(ingredient);
        ingredient.setRecipe(null);
    }

    public void addRecipeReview(RecipeReview recipeReview) {
        this.recipeReviews.add(recipeReview);
        recipeReview.setRecipe(this);
    }

    public void removeRecipeReview(RecipeReview recipeReview) {
        this.recipeReviews.remove(recipeReview);
        recipeReview.setRecipe(null);
    }

    public String formatCookingTime(int minutes) {
        int hours = minutes / 60;
        int remainingMinutes = minutes % 60;
        return hours > 0 ? hours + " hrs " + remainingMinutes + " mins" : remainingMinutes + " mins";
    }
}
