package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Exceptions.ErrorMessages;
import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Exceptions.UnauthorizedActionException;
import Allrecipes.Recipesdemo.Mappers.RecipeMapper;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.CategoryService;
import Allrecipes.Recipesdemo.Service.RecipeService;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import java.util.stream.Collectors;

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


    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody @Valid RecipeCreateRequest request, HttpServletRequest httpRequest) {
        try {
            log.debug("Attempting to create a new recipe.");
            User user = getCurrentUser(httpRequest);
            recipeService.createRecipe(request, user);
            log.info("Recipe created successfully by User ID: {}", user.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body("Recipe created successfully.");
        } catch (IllegalArgumentException e) {
            log.warn("Recipe creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(String.format(ErrorMessages.INVALID_REQUEST, e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating recipe.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.INTERNAL_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeService.getRecipeById(id);
        RecipeResponse response = RecipeMapper.toRecipeResponse(recipe);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/old/{id}")
    public ResponseEntity<?> OldgetRecipeById(@PathVariable Long id) {
        try {
            log.debug("Fetching recipe with ID: {}", id);
            RecipeResponse recipeResponse = recipeService.toRecipeResponse(recipeService.getRecipeById(id)); // New line
            return ResponseEntity.ok(recipeResponse); // Updated to return RecipeResponse - New line
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found for ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("Recipe with ID %s not found.", id));
        } catch (Exception e) {
            log.error("Error retrieving recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long category) {
        try {
            log.debug("Fetching recipes with pagination - Page: {}, Size: {}, Category: {}", page, size, category);
            Pageable pageable = PageRequest.of(page, size);
            Page<RecipeResponse> resultPage;

            if (category != null) {
                Page<Recipe> recipePage = recipeService.getRecipesByCategory(category, pageable);
                List<RecipeResponse> responses = recipePage.getContent()
                        .stream()
                        .map(RecipeMapper::toRecipeResponse)
                        .collect(Collectors.toList());
                resultPage = new PageImpl<>(responses, pageable, recipePage.getTotalElements());
            } else {
                resultPage = recipeService.getAllRecipesWithResponse(pageable);
            }

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("content", resultPage.getContent());
            responseBody.put("totalPages", resultPage.getTotalPages());
            responseBody.put("totalElements", resultPage.getTotalElements());
            responseBody.put("size", resultPage.getSize());
            responseBody.put("number", resultPage.getNumber());

            log.info("Retrieved {} recipes.", resultPage.getTotalElements());
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            log.error("Error retrieving recipes.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ErrorMessages.INTERNAL_ERROR);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeCreateRequest request, HttpServletRequest httpRequest) {
        User user = null;
        try {
            log.debug("Attempting to update recipe with ID: {}", id); // New line
            user = getCurrentUser(httpRequest);
            recipeService.updateRecipe(id, request, user);
            log.info("Recipe with ID {} updated successfully by User ID {}", id, user.getId()); // New line
            return ResponseEntity.ok("Recipe updated successfully.");
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found for update: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format(ErrorMessages.RECIPE_NOT_FOUND, id));
        } catch (UnauthorizedActionException e) {
            log.warn("Unauthorized update attempt by User ID {} on Recipe ID {}", user != null ? user.getId() : "Unknown", id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorMessages.UNAUTHORIZED_ACTION);
        } catch (Exception e) {
            log.error("Error updating recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMessages.INTERNAL_ERROR);
        }
    }
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        // fetch categories from the DB or service
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id, HttpServletRequest request) {
        User user = null;
        try {
            log.debug("Attempting to delete recipe with ID: {}", id); // New line
            user = getCurrentUser(request);
            recipeService.deleteRecipe(id, user);
            log.info("Recipe with ID {} deleted successfully by User ID {}", id, user.getId()); // New line
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RecipeNotFoundException e) {
            log.warn("Recipe not found for deletion: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe with ID " + id + " not found.");
        } catch (UnauthorizedActionException e) {
            log.warn("Unauthorized deletion attempt by User ID {} on Recipe ID {}", user != null ? user.getId() : "Unknown", id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this recipe.");
        } catch (Exception e) {
            log.error("Error deleting recipe with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred while deleting the recipe.");
        }
    }


    private User getCurrentUser(HttpServletRequest request) throws IllegalArgumentException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header.");
            throw new IllegalArgumentException("Authorization header is missing or invalid.");
        }

        String token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            log.debug("Validating JWT token.");
            UserDetails userDetails = jwtUtil.getUserDetails(token);
            String username = userDetails.getUserName();
            String email = userDetails.getEmail();

            return userRepository.findByUsernameOrEmail(username, email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user associated with token."));
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT token.", e);
            throw new IllegalArgumentException("JWT token is malformed.");
        } catch (Exception e) {
            log.error("Error validating JWT token.", e);
            throw new IllegalArgumentException("Error occurred while validating token.");
        }
    }

}
