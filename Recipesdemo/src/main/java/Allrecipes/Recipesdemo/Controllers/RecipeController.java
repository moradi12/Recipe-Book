package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Exceptions.UnauthorizedActionException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.CategoryService;
import Allrecipes.Recipesdemo.Service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import javax.security.auth.login.LoginException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class RecipeController {

    private final RecipeService recipeService;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final JWT jwtUtil;

    /**
     * Creates a new recipe. Accessible only by authenticated users.
     *
     * @param request      The RecipeCreateRequest containing recipe details.
     * @param httpRequest  The HTTP request containing the Authorization header.
     * @return A ResponseEntity with a success message.
     */
    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody RecipeCreateRequest request,
                                          HttpServletRequest httpRequest) {
        try {
            log.debug("Attempting to create a new recipe.");
            User user = getCurrentUser(httpRequest);
            recipeService.createRecipe(request, user);
            log.info("Recipe created successfully by User ID: {}", user.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Recipe created successfully.");
        } catch (IllegalArgumentException e) {
            log.warn("Recipe creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error creating recipe.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while creating the recipe.");
        }
    }

    /**
     * Retrieves a recipe by its ID.
     *
     * @param id The ID of the recipe.
     * @return The Recipe object if found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        try {
            log.debug("Fetching recipe with ID: {}", id);
            Recipe recipe = recipeService.getRecipeById(id);
            log.info("Recipe retrieved successfully: {}", id);
            return ResponseEntity.ok(recipe);
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (Exception e) {
            log.error("Error retrieving recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred.");
        }
    }

    /**
     * Retrieves all recipes with pagination.
     *
     * @param page The page number.
     * @param size The page size.
     * @return A paginated list of RecipeResponse.
     */
    @GetMapping
    public ResponseEntity<?> getAllRecipes(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        try {
            log.debug("Fetching all recipes with pagination - Page: {}, Size: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<RecipeResponse> resultPage = recipeService.getAllRecipesWithResponse(pageable);
            log.info("Retrieved {} recipes.", resultPage.getTotalElements());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("content", resultPage.getContent());
            responseBody.put("totalPages", resultPage.getTotalPages());
            responseBody.put("totalElements", resultPage.getTotalElements());
            responseBody.put("size", resultPage.getSize());
            responseBody.put("number", resultPage.getNumber());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            log.error("Error retrieving all recipes.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while retrieving recipes.");
        }
    }

    /**
     * Updates an existing recipe. Accessible only by the recipe owner or an admin.
     *
     * @param id           The ID of the recipe to update.
     * @param request      The RecipeCreateRequest containing updated details.
     * @param httpRequest  The HTTP request containing the Authorization header.
     * @return A ResponseEntity with a success message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id,
                                          @Valid @RequestBody RecipeCreateRequest request,
                                          HttpServletRequest httpRequest) {
        User user = null; // Declare user outside the try block
        try {
            log.debug("Attempting to update recipe with ID: {}", id);
            user = getCurrentUser(httpRequest);
            recipeService.updateRecipe(id, request, user);
            log.info("Recipe with ID {} updated successfully by User ID {}", id, user.getId());
            return ResponseEntity.ok("Recipe updated successfully.");
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found for update: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (UnauthorizedActionException e) {
            if (user != null) {
                log.warn("Unauthorized update attempt by User ID {} on Recipe ID {}",
                        user.getId(), id);
            } else {
                log.warn("Unauthorized update attempt on Recipe ID {} without user information.", id);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to update this recipe.");
        } catch (Exception e) {
            log.error("Error updating recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while updating the recipe.");
        }
    }

    /**
     * Deletes a recipe by its ID. Accessible only by the recipe owner or an admin.
     *
     * @param id           The ID of the recipe to delete.
     * @param httpRequest  The HTTP request containing the Authorization header.
     * @return No Content if deletion is successful.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id,
                                          HttpServletRequest httpRequest) {
        User user = null; // Declare user outside the try block
        try {
            log.debug("Attempting to delete recipe with ID: {}", id);
            user = getCurrentUser(httpRequest);
            recipeService.deleteRecipe(id, user);
            log.info("Recipe with ID {} deleted successfully by User ID {}", id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found for deletion: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (UnauthorizedActionException e) {
            if (user != null) {
                log.warn("Unauthorized deletion attempt by User ID {} on Recipe ID {}",
                        user.getId(), id);
            } else {
                log.warn("Unauthorized deletion attempt on Recipe ID {} without user information.", id);
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to delete this recipe.");
        } catch (Exception e) {
            log.error("Error deleting recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while deleting the recipe.");
        }
    }

    /**
     * Searches for recipes by title.
     *
     * @param title The title keyword to search for.
     * @return A list of RecipeResponse matching the search criteria.
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchRecipes(@RequestParam String title) {
        try {
            log.debug("Searching for recipes with title containing: {}", title);
            List<RecipeResponse> recipes = recipeService.searchRecipesByTitle(title);
            if (recipes.isEmpty()) {
                log.info("No recipes found containing title: {}", title);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No recipes found with the title containing: " + title);
            }
            log.info("Found {} recipes containing title: {}", recipes.size(), title);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            log.error("Error searching for recipes with title: {}", title, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while searching for recipes.");
        }
    }

    /**
     * Retrieves all categories.
     *
     * @return A list of Category objects.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
            log.debug("Fetching all categories.");
            List<Category> categories = categoryService.getAllCategories();
            if (categories.isEmpty()) {
                log.info("No categories found.");
                return ResponseEntity.noContent().build();
            }
            log.info("Retrieved {} categories.", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            log.error("Error retrieving all categories.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * Extracts and validates the current user from the HTTP request.
     *
     * @param request The HTTP request containing the Authorization header.
     * @return The authenticated User.
     * @throws LoginException             If the token is invalid or expired.
     * @throws IllegalArgumentException   If user details are missing or invalid.
     */
    private User getCurrentUser(HttpServletRequest request) throws LoginException, IllegalArgumentException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header.");
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        log.debug("Extracting user details from token.");
        UserDetails userDetails = jwtUtil.getUserDetails(authHeader);

        String username = userDetails.getUserName();
        String email = userDetails.getEmail();

        User user = userRepository.findByUsernameOrEmail(username, email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        return user;
    }
}
