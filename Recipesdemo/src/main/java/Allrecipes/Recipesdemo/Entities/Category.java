package Allrecipes.Recipesdemo.Entities;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Entities.Enums.FoodCategories;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FoodCategories foodCategory;

    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    @Builder.Default
    @ToString.Exclude
    private Set<Recipe> recipes = new HashSet<>();

    public void addRecipe(Recipe recipe) {
        this.recipes.add(recipe);
        recipe.getCategories().add(this);
    }

    public void removeRecipe(Recipe recipe) {
        this.recipes.remove(recipe);
        recipe.getCategories().remove(this);
    }
}
