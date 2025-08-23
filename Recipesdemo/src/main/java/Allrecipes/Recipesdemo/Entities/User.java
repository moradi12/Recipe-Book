package Allrecipes.Recipesdemo.Entities;

import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "recipe_id")
    )
    @Builder.Default
    @ToString.Exclude
    @JsonIgnore
    private Set<Recipe> favorites = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    @JsonIgnore
    private Set<RecipeReview> recipeReviews = new HashSet<>();

    public void addFavorite(Recipe recipe) {
        this.favorites.add(recipe);
        recipe.getFavorites().add(this);
    }

    public void removeFavorite(Recipe recipe) {
        this.favorites.remove(recipe);
        recipe.getFavorites().remove(this);
    }

    public void addRecipeReview(RecipeReview recipeReview) {
        this.recipeReviews.add(recipeReview);
        recipeReview.setUser(this);
    }

    public void removeRecipeReview(RecipeReview recipeReview) {
        this.recipeReviews.remove(recipeReview);
        recipeReview.setUser(null);
    }
}
