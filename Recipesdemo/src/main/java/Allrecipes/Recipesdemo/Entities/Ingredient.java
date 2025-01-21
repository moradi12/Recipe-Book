package Allrecipes.Recipesdemo.Entities;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // Control Lombok's equals and hashCode
@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include // Only include 'id' in equals and hashCode
    private Long id;

    @NotBlank(message = "Ingredient name is mandatory")
    private String name;

    @NotBlank(message = "Ingredient quantity is mandatory")
    private String quantity;

    @NotBlank(message = "Ingredient unit is mandatory")
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @ToString.Exclude
    private Recipe recipe;

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
        if (recipe != null && !recipe.getIngredients().contains(this)) {
            recipe.getIngredients().add(this);
        }
    }
}
