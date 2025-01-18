package Allrecipes.Recipesdemo.Controllers;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Enums.FoodCategories;
import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Entities.UserDetails;
import Allrecipes.Recipesdemo.Security.JWT.JWT;
import Allrecipes.Recipesdemo.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private final JWT jwtUtil;


    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        log.debug("Fetching all categories.");
        List<Category> categories = categoryService.getAllCategories();
        log.info("Retrieved {} categories.", categories.size());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/food-categories")
    public ResponseEntity<List<Map<String, String>>> getFoodCategories() {
        log.debug("Fetching all predefined food categories.");

        // Convert enum values to a list of maps for better readability (name and description)
        List<Map<String, String>> foodCategories = List.of(FoodCategories.values()).stream()
                .map(foodCategory -> Map.of(
                        "name", foodCategory.name(),
                        "description", foodCategory.getDescription()
                ))
                .toList();

        log.info("Retrieved {} food categories.", foodCategories.size());
        return ResponseEntity.ok(foodCategories);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Category> getCategoryByName(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) throws LoginException {
        log.debug("Fetching category by name: {}", name);
        jwtUtil.checkUser(authHeader, UserType.ADMIN); // Only Admin can access
        Category category = categoryService.getCategoryByName(name);
        if (category == null) {
            log.warn("Category not found with name: {}", name);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Retrieved category: {}", name);
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Category category) throws LoginException {
        log.debug("Creating new category: {}", category.getFoodCategory());
        jwtUtil.checkUser(authHeader, UserType.ADMIN); // Only Admin can access
        Category createdCategory = categoryService.createCategory(category.getFoodCategory());
        log.info("Created category with ID: {}", createdCategory.getId());
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }


    @DeleteMapping("/{name}")
    public ResponseEntity<Map<String, String>> deleteCategory(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) throws LoginException {
        log.debug("Deleting category with name: {}", name);
        jwtUtil.checkUser(authHeader, UserType.ADMIN); // Only Admin can access
        categoryService.deleteCategoryByName(name);
        log.info("Deleted category: {}", name);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully."));
    }

    @GetMapping("/{name}/exists")
    public ResponseEntity<Boolean> checkCategoryExists(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String name) throws LoginException {
        log.debug("Checking existence of category: {}", name);
        jwtUtil.checkUser(authHeader, UserType.ADMIN);
        boolean exists = categoryService.categoryExists(name);
        log.info("Category '{}' exists: {}", name, exists);
        return ResponseEntity.ok(exists);
    }
}
