package Allrecipes.Recipesdemo.Entities;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="favorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="recipe_id", nullable=false)
    private Recipe recipe;

    @Column(name = "favorited_at")
    private LocalDateTime favoritedAt;

    @PrePersist
    protected void onCreate() {
        favoritedAt = LocalDateTime.now();
    }
}