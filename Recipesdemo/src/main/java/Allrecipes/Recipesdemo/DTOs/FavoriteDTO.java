package Allrecipes.Recipesdemo.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * A simple Data Transfer Object for returning favorite info to the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteDTO {
    private Long id;
    private UserDTO user;
    private RecipeDTO recipe;
    private LocalDateTime favoritedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String userName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecipeDTO {
        private Long id;
        private String title;
    }
}
