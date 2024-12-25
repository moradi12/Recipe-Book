package Allrecipes.Recipesdemo.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Ingredient name is mandatory")
    private String name;

    @NotBlank(message = "Ingredient quantity is mandatory")
    private String quantity;

    @NotBlank(message = "Ingredient unit is mandatory")
    private String unit;
}
