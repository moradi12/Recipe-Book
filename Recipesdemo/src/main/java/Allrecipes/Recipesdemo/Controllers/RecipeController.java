package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Exceptions.UnauthorizedActionException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Repositories.UserRepository;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.RecipeService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.security.auth.login.LoginException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin
public class RecipeController {

    private final RecipeService recipeService;
    private final UserRepository userRepository;
    private final JWT jwtUtil;

    public RecipeController(RecipeService recipeService, UserRepository userRepository, JWT jwtUtil) {
        this.recipeService = recipeService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(
             @RequestBody RecipeCreateRequest request,
            HttpServletRequest httpRequest) {
        try {
            UserDetails userDetails = getUserDetailsFromRequest(httpRequest);
            User user = userRepository.findById(userDetails.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
            recipeService.createRecipe(request, user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Recipe created successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while creating the recipe.");
        }
    }


    private UserDetails getUserDetailsFromRequest(HttpServletRequest request) throws LoginException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        return jwtUtil.getUserDetails(token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeById(id);
            return ResponseEntity.ok(recipe);
        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred.");
        }
    }

    @GetMapping("/all")
    @CrossOrigin(origins = "*") // Allows access from all origins
    public ResponseEntity<?> getAllRecipes(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<RecipeResponse> resultPage = recipeService.getAllRecipesWithResponse(pageable);

            // Build a custom response map
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("content", resultPage.getContent());
            responseBody.put("totalPages", resultPage.getTotalPages());
            responseBody.put("totalElements", resultPage.getTotalElements());
            responseBody.put("size", resultPage.getSize());
            responseBody.put("number", resultPage.getNumber());

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while retrieving recipes.");
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id,
                                          @Valid @RequestBody RecipeCreateRequest request,
                                          HttpServletRequest httpRequest) {
        try {
            UserDetails userDetails = getUserDetailsFromRequest(httpRequest);
            User user = userRepository.findById(userDetails.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
            recipeService.updateRecipe(id, request, user);
            return ResponseEntity.ok("Recipe updated successfully.");
        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (UnauthorizedActionException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to update this recipe.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while updating the recipe.");
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id,
                                          HttpServletRequest httpRequest) {
        try {
            UserDetails userDetails = getUserDetailsFromRequest(httpRequest);
            User user = userRepository.findById(userDetails.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
            recipeService.deleteRecipe(id, user);
            return ResponseEntity.noContent().build();
        } catch (RecipeNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        } catch (UnauthorizedActionException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not authorized to delete this recipe.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while deleting the recipe.");
        }
    }


    @GetMapping("/search")
    public ResponseEntity<?> searchRecipes(@RequestParam String title) {
        try {
            List<RecipeResponse> recipes = recipeService.searchRecipesByTitle(title);
            if (recipes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No recipes found with the title containing: " + title);
            }
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while searching for recipes.");
        }
    }}
