package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Rating.RatingResponse;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.RatingService;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import javax.security.auth.login.LoginException;
import java.util.List;

/**
 * REST Controller for managing Ratings.
 */
@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final UserRepository userRepository;
    private final JWT jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getRatingById(@PathVariable Long id) {
        try {
            RatingResponse response = ratingService.getRatingById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rating not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Extract user details from the JWT
            UserDetails userDetails = getUserDetailsFromRequest(request);
            User user = userRepository.findById(userDetails.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            // Call service method
            ratingService.deleteRating(id, user);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rating not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRatings() {
        try {
            List<RatingResponse> ratings = ratingService.getAllRatings();
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<?> getRatingsByRecipeId(@PathVariable Long recipeId) {
        try {
            List<RatingResponse> ratings = ratingService.getRatingsByRecipeId(recipeId);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRatingsByUserId(@PathVariable Long userId) {
        try {
            List<RatingResponse> ratings = ratingService.getRatingsByUserId(userId);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    /**
     * Extract user details from the JWT in the Authorization header.
     */
    private UserDetails getUserDetailsFromRequest(HttpServletRequest request) throws LoginException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtUtil.getUserDetails(token);
    }
}
