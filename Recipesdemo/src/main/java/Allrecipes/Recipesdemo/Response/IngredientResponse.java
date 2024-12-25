package Allrecipes.Recipesdemo.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IngredientResponse {
    private String name;
    private String quantity;
    private String unit;
}
