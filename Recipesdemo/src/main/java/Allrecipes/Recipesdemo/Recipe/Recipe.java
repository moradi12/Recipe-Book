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
import java.sql.SQLException;
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


    private String photoDirectory;

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
    @ToString.Exclude
    private User createdBy;

    @Column(nullable = false)
    private boolean containsGluten = true;
@ManyToMany
private Set<Category> categories;

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    private Set<User> favorites = new HashSet<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private Set<RecipeReview> recipeReviews = new HashSet<>();

    public String getPhotoAsBase64() {
        if (photo == null) {
            return null;
        }
        try {
            int blobLength = (int) photo.length();
            byte[] blobAsBytes = photo.getBytes(1, blobLength);
            return Base64.getEncoder().encodeToString(blobAsBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error reading photo Blob", e);
        }
    }

    public void setPhotoFromBase64(String photoBase64) throws SQLException {
        if (photoBase64 != null) {
            this.photo = new javax.sql.rowset.serial.SerialBlob(Base64.getDecoder().decode(photoBase64));
        } else {
            this.photo = null;
        }
    }


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
    public boolean isValidContainsGluten(Boolean containsGluten) {
        return containsGluten != null;
    }
    public boolean getContainsGlutenOrDefault() {
        return containsGluten;
    }

    public void setContainsGluten(Boolean containsGluten) {
        this.containsGluten = containsGluten != null ? containsGluten : true;
    }
    public boolean getContainsGluten() {
        return containsGluten;
    }


}
