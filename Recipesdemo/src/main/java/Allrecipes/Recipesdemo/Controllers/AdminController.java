package Allrecipes.Recipesdemo.Controllers;

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

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final RecipeService recipeService;
    private final JWT jwtUtil;

    public AdminController(AdminService adminService, RecipeService recipeService, JWT jwtUtil) {
        this.adminService = adminService;
        this.recipeService = recipeService;
        this.jwtUtil = jwtUtil;
    }

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
    public ResponseEntity<?> addRecipe(@RequestHeader("Authorization") String authHeader, @RequestBody RecipeCreateRequest request) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = mapToUser(jwtUtil.getUserDetails(authHeader));
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
    public ResponseEntity<?> updateRecipe(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody RecipeCreateRequest request) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = mapToUser(jwtUtil.getUserDetails(authHeader));
                var updatedRecipe = recipeService.updateRecipe(id, request, currentUser);
                return Map.of("message", "Recipe updated successfully.", "recipeId", updatedRecipe.getId().toString());
            } catch (LoginException e) {
                throw new RuntimeException("Unauthorized: Invalid token", e);
            }
        });
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<?> deleteRecipe(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        return handleRequest(authHeader, UserType.ADMIN, () -> {
            try {
                User currentUser = mapToUser(jwtUtil.getUserDetails(authHeader));
                recipeService.deleteRecipe(id, currentUser);
                return Map.of("message", "Recipe deleted successfully.");
            } catch (LoginException e) {
                throw new RuntimeException("Unauthorized: Invalid token", e);
            }
        });
    }


    private ResponseEntity<?> handleRequest(String authHeader, UserType requiredRole, Supplier<Object> action) {
        try {
            jwtUtil.checkUser(authHeader, requiredRole);
            return ResponseEntity.ok(action.get());
        } catch (LoginException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized: Invalid token"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Bad Request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal Server Error: " + e.getMessage()));
        }
    }

    private User mapToUser(UserDetails userDetails) {
        return User.builder()
                .id(userDetails.getUserId())
                .username(userDetails.getUserName())
                .email(userDetails.getEmail())
                .userType(userDetails.getUserType())
                .build();
    }
}
