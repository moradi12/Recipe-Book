
package Allrecipes.Recipesdemo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;     // e.g., "Dessert"
    // Add any other fields you want to expose (like `foodCategory` or `description`)
}
