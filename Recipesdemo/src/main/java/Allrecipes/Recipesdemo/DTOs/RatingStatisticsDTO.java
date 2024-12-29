package Allrecipes.Recipesdemo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingStatisticsDTO {
    private Long recipeId;
    private double averageRating;
    private long totalRatings;
}
