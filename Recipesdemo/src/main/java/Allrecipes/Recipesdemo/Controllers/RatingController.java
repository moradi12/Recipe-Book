package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Rating.RatingResponse;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.RatingService;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RatingController {

    private final RatingService ratingService;
    private final UserRepository userRepository;
    private final JWT jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getRatingById(@PathVariable Long id) {
        try {
            log.debug("Fetching rating with ID: {}", id);
            RatingResponse response = ratingService.getRatingById(id);
            log.info("Rating retrieved successfully: {}", id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Rating not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rating not found: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error retrieving rating with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id, HttpServletRequest request) {
        try {
            log.debug("Attempting to delete rating with ID: {}", id);
            // Extract user details from the JWT
            UserDetails userDetails = getUserDetailsFromRequest(request);
            User user = userRepository.findById(userDetails.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            if (!user.getUserType().equals(UserType.ADMIN) && !ratingService.isRatingOwner(id, user)) {
                log.warn("User ID {} is not authorized to delete Rating ID {}", user.getId(), id);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this rating.");
            }

            ratingService.deleteRating(id, user);
            log.info("Rating with ID {} deleted successfully by User ID {}", id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Deletion failed for Rating ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rating not found: " + e.getMessage());
        } catch (LoginException e) {
            log.warn("Unauthorized deletion attempt for Rating ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting rating with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRatings() {
        try {
            log.debug("Fetching all ratings.");
            List<RatingResponse> ratings = ratingService.getAllRatings();
            log.info("Retrieved {} ratings.", ratings.size());
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            log.error("Error retrieving all ratings.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<?> getRatingsByRecipeId(@PathVariable Long recipeId) {
        try {
            log.debug("Fetching ratings for Recipe ID: {}", recipeId);
            List<RatingResponse> ratings = ratingService.getRatingsByRecipeId(recipeId);
            log.info("Retrieved {} ratings for Recipe ID {}", ratings.size(), recipeId);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            log.warn("Recipe not found: {}", recipeId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error retrieving ratings for Recipe ID: {}", recipeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRatingsByUserId(@PathVariable Long userId) {
        try {
            log.debug("Fetching ratings for User ID: {}", userId);
            List<RatingResponse> ratings = ratingService.getRatingsByUserId(userId);
            log.info("Retrieved {} ratings for User ID {}", ratings.size(), userId);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            log.warn("User not found: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error retrieving ratings for User ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    private UserDetails getUserDetailsFromRequest(HttpServletRequest request) throws LoginException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header.");
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        log.debug("Extracting user details from token.");
        return jwtUtil.getUserDetails(token);
    }
}
