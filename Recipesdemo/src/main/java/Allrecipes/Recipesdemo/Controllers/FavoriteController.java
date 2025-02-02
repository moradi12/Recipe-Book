package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Favorite;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Repositories.FavoriteRepository;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Slf4j
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final JWT jwt;

    /**
     * Add a recipe to favorites for the logged-in user.
     */
    @PostMapping("/{recipeId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long recipeId, HttpServletRequest request) {
        try {
            User user = getUserFromToken(request);

            // Check if recipe exists
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new IllegalArgumentException("Recipe not found"));

            // Check if favorite already exists
            boolean exists = favoriteRepository.existsByUserIdAndRecipeId(user.getId(), recipeId);
            if (exists) {
                return ResponseEntity.badRequest().body("Recipe is already in your favorites.");
            }

            // Create the favorite
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .recipe(recipe)
                    .build();
            favoriteRepository.save(favorite);

            return ResponseEntity.ok("Recipe added to favorites!");
        } catch (Exception e) {
            log.error("Error adding favorite:", e);
            return ResponseEntity.badRequest().body("Could not add recipe to favorites: " + e.getMessage());
        }
    }

    /**
     * Remove a recipe from favorites for the logged-in user.
     */
    @DeleteMapping("/{recipeId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long recipeId, HttpServletRequest request) {
        try {
            User user = getUserFromToken(request);

            // Find the favorite
            Optional<Favorite> favoriteOpt = favoriteRepository.findByUserIdAndRecipeId(user.getId(), recipeId);
            if (favoriteOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Recipe is not in your favorites.");
            }

            favoriteRepository.delete(favoriteOpt.get());
            return ResponseEntity.ok("Recipe removed from favorites.");
        } catch (Exception e) {
            log.error("Error removing favorite:", e);
            return ResponseEntity.badRequest().body("Could not remove recipe from favorites: " + e.getMessage());
        }
    }

    /**
     * Get all favorites for the logged-in user.
     */
    @GetMapping
    public ResponseEntity<?> getUserFavorites(HttpServletRequest request) {
        try {
            User user = getUserFromToken(request);

            // Get all favorites for the user
            List<Favorite> favorites = favoriteRepository.findByUserId(user.getId());
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            log.error("Error fetching favorites:", e);
            return ResponseEntity.badRequest().body("Could not fetch favorites: " + e.getMessage());
        }
    }

    /**
     * Helper method to retrieve current user from the token
     */
    private User getUserFromToken(HttpServletRequest request) throws LoginException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        UserDetails userDetails = jwt.getUserDetails(token);

        return userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
