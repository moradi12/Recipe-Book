package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.DTOs.AuthResponse;
import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.AdminService;
import Allrecipes.Recipesdemo.Service.RecipeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;
import java.util.Map;
import java.util.function.Supplier;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final RecipeService recipeService;
    private final JWT jwtProvider;

    public AdminController(AdminService adminService, RecipeService recipeService, JWT jwtProvider) {
        this.adminService = adminService;
        this.recipeService = recipeService;
        this.jwtProvider = jwtProvider;
    }

    /**
     * Utility method to strip out "Bearer " from the Authorization header,
     * validate and parse the token, then build a User instance.
     */
    private User getCurrentUser(String authHeader) throws LoginException {
        // 1) Remove "Bearer " from the token
        String tokenWithoutBearer = authHeader.replace("Bearer ", "");

        // 2) Extract user details using the raw token
        UserDetails userDetails = jwtProvider.getUserDetails(tokenWithoutBearer);

        // 3) Validate
        if (userDetails == null || !jwtProvider.validateToken(tokenWithoutBearer)) {
            throw new LoginException("Invalid token");
        }
        return User.builder()
                .id(userDetails.getUserId())
                .username(userDetails.getUserName())
                .email(userDetails.getEmail())
                .userType(userDetails.getUserType())
                .build();
    }

    /**
     * Common error-handling wrapper around actions that require admin privileges.
     */
    private ResponseEntity<?> handleRequest(String authHeader, UserType requiredRole, Supplier<Object> action) {
        try {
            // Remove "Bearer " before passing the token to checkUser
            String tokenWithoutBearer = authHeader.replace("Bearer ", "");
            jwtProvider.checkUser(tokenWithoutBearer, requiredRole);
            return ResponseEntity.ok(action.get());
        } catch (LoginException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Invalid token"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Bad Request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal Server Error: " + e.getMessage()));
        }
    }

    /**
     * Example usage of jwtProvider.getHeaders(tokenWithoutBearer).
     * If you only want to send back a refreshed header, you can do something like:
     *
     *   HttpHeaders newHeaders = jwtProvider.getHeaders(tokenWithoutBearer);
     *   return new ResponseEntity<>(someBody, newHeaders, HttpStatus.OK);
     *
     * But here we will keep the existing style of returning a body.
     */

    @GetMapping("/recipes/pending")
    public ResponseEntity<?> getPendingRecipes(@RequestHeader("Authorization") String authHeader) {
        return handleRequest(authHeader, UserType.ADMIN, adminService::getPendingRecipes);
    }

    @PutMapping("/recipes/{id}/approve")
    public ResponseEntity<?> approveRecipe(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            adminService.approveRecipe(id);
            return Map.of("message", "Recipe approved successfully.");
        });
    }

    @PutMapping("/recipes/{id}/reject")
    public ResponseEntity<?> rejectRecipe(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            adminService.rejectRecipe(id);
            return Map.of("message", "Recipe rejected successfully.");
        });
    }

    @PostMapping("/recipes")
    public ResponseEntity<?> addRecipe(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody RecipeCreateRequest request) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = getCurrentUser(authHeader);
                var recipe = recipeService.createRecipe(request, currentUser);
                return Map.of("message", "Recipe added successfully.", "recipeId", recipe.getId().toString());
            } catch (LoginException e) {
                throw new RuntimeException("Unauthorized: Invalid token", e);
            }
        });
    }

    @GetMapping("/recipes")
    public ResponseEntity<?> getAllRecipes(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        return handleRequest(authHeader, UserType.ADMIN, () -> {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
            Page<RecipeResponse> recipes = recipeService.getAllRecipesWithResponse(pageable);
            return recipes;
        });
    }

    @PutMapping("/recipes/{id}")
    public ResponseEntity<?> updateRecipe(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long id,
                                          @RequestBody RecipeCreateRequest request) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = getCurrentUser(authHeader);
                var updatedRecipe = recipeService.updateRecipe(id, request, currentUser);
                return Map.of("message", "Recipe updated successfully.", "recipeId", updatedRecipe.getId().toString());
            } catch (LoginException e) {
                throw new RuntimeException("Unauthorized: Invalid token", e);
            }
        });
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<?> deleteRecipe(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long id) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = getCurrentUser(authHeader);
                recipeService.deleteRecipe(id, currentUser);
                return Map.of("message", "Recipe deleted successfully.");
            } catch (LoginException e) {
                throw new RuntimeException("Unauthorized: Invalid token", e);
            }
        });
    }
}
