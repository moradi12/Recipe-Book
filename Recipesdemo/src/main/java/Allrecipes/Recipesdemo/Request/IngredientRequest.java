package Allrecipes.Recipesdemo.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientRequest {

    @NotBlank(message = "Ingredient name is mandatory")
    private String name;

    @NotBlank(message = "Ingredient quantity is mandatory")
    private String quantity;

    @NotBlank(message = "Ingredient unit is mandatory")
    private String unit;
}
