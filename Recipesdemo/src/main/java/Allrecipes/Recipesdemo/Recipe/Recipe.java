package Allrecipes.Recipesdemo.Recipe;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id") // Creates a foreign key in the ingredients table
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

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private boolean containsGluten = true;

    @ManyToMany
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    public String formatCookingTime(int minutes) {
        int hours = minutes / 60;
        int remainingMinutes = minutes % 60;
        return hours > 0 ? hours + " hrs " + remainingMinutes + " mins" : remainingMinutes + " mins";
    }
}
