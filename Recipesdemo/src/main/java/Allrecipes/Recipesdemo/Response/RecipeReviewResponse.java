package Allrecipes.Recipesdemo.Response;

import Allrecipes.Recipesdemo.DTOs.CategoryDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RecipeReviewResponse {
    private Long id;
    private List<CategoryDto> categories;
    @Min(1)
    @Max(5)
    private Integer score;
    private String comment;
    private Long recipeId;
    private Long userId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
