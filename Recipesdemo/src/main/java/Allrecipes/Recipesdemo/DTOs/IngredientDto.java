package Allrecipes.Recipesdemo.DTOs;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientDto {
    private Long id;
    private String name;
    private String quantity;
    private String unit;
}
