package Allrecipes.Recipesdemo.DTOs;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientDto {
    private Long id;       // Optional, if you need to reference the ingredient in the database
    private String name;
    private String quantity;
    private String unit;
}
