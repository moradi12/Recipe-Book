package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Enums.UserType;
import Allrecipes.Recipesdemo.Entities.Ingredient;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Exceptions.InvalidRecipeDataException;
import Allrecipes.Recipesdemo.Exceptions.RecipeNotFoundException;
import Allrecipes.Recipesdemo.Exceptions.UnauthorizedActionException;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import Allrecipes.Recipesdemo.Recipe.RecipeResponse;
import Allrecipes.Recipesdemo.Entities.Enums.RecipeStatus;
import Allrecipes.Recipesdemo.Repositories.IngredientsRepo;
import Allrecipes.Recipesdemo.Repositories.RecipeRepository;
import Allrecipes.Recipesdemo.Repositories.CategoryRepository;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientsRepo ingredientsRepo;
    public RecipeService(RecipeRepository recipeRepository, CategoryRepository categoryRepository, IngredientsRepo ingredientsRepo) {
        this.recipeRepository = recipeRepository;
        this.categoryRepository = categoryRepository;
        this.ingredientsRepo = ingredientsRepo;
    }

    public void savePhoto(String base64Photo, String targetPath) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(base64Photo);
            Files.write(Path.of(targetPath), decodedBytes);
        } catch (Exception e) {
            System.err.println("Error saving photo: " + e.getMessage());
        }}

    public Page<Recipe> getRecipesByCategory(Long categoryId, Pageable pageable) {
        return recipeRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<Recipe> getAllRecipes(Pageable pageable) {
        return recipeRepository.findAll(pageable);
    }


    @Value("${app.recipe-photos.directory}")
    private String photoDirectory;



    public void deleteRecipe(Long id, User user) {
        if (id == null || user == null) {
            throw new IllegalArgumentException("Invalid input: Recipe ID and user cannot be null.");
        }

        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + id + " not found"));

        // Allow the recipe's creator OR an Admin to delete. Otherwise, deny.
        boolean isOwner = recipe.getCreatedBy().getId().equals(user.getId());
        boolean isAdmin = user.getUserType() == UserType.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You do not have permission to delete this recipe");
        }

        recipeRepository.delete(recipe);
    }

    public String getPhotoDirectory() {
        return photoDirectory;
    }

    public void setPhotoDirectory(Recipe recipe) {
        recipe.setPhotoDirectory(photoDirectory);
    }
    // ================================
    //  GET ALL (Paginated)
    // ================================
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getAllRecipesWithResponse(Pageable pageable) {
        Page<Recipe> recipesPage = recipeRepository.findAll(pageable);
        return recipesPage.map(this::toRecipeResponse);
    }

    // ================================
    //  GET ALL (Non-paginated)
    // ================================
    @Transactional(readOnly = true)
    public List<RecipeResponse> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();
        return recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

    // ================================
    //  CREATE RECIPE
    // ================================
    public Recipe createRecipe(RecipeCreateRequest req, User user) {
        validateRecipeRequest(req);

        // 1) Load categories from DB using the numeric IDs from req.getCategoryIds()
        Set<Category> categories = new HashSet<>();
        if (req.getCategoryIds() != null && !req.getCategoryIds().isEmpty()) {
            categories = categoryRepository.findAllById(req.getCategoryIds())
                    .stream()
                    .collect(Collectors.toSet());
            if (categories.size() != req.getCategoryIds().size()) {
                throw new InvalidRecipeDataException("One or more categories not found");
            }
        }

        // 2) Build list of Ingredient entities
        List<Ingredient> ingredients = req.getIngredients().stream()
                .map(dto -> Ingredient.builder()
                        .name(dto.getName())
                        .quantity(dto.getQuantity())
                        .unit(dto.getUnit())
                        .build()
                )
                .collect(Collectors.toList());

        // 3) Convert Base64 photo to Blob (if present)
        Blob photoBlob = null;
        if (req.getPhoto() != null && !req.getPhoto().isEmpty()) {
            try {
                photoBlob = new javax.sql.rowset.serial.SerialBlob(
                        Base64.getDecoder().decode(req.getPhoto())
                );
            } catch (SQLException e) {
                throw new InvalidRecipeDataException("Error decoding photo", e);
            }
        }

        // 4) Build & save the Recipe entity, including the attached categories
        Recipe recipe = Recipe.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .ingredients(ingredients)
                .preparationSteps(req.getPreparationSteps())
                .cookingTime(req.getCookingTime())
                .servings(req.getServings())
                .dietaryInfo(req.getDietaryInfo())
                .status(RecipeStatus.PENDING_APPROVAL)
                .createdBy(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .containsGluten(req.getContainsGlutenOrDefault())
                .categories(categories)
                .photo(photoBlob)
                .build();

        // Associate each Ingredient with the new Recipe
        ingredients.forEach(ingredient -> ingredient.setRecipe(recipe));

        Recipe savedRecipe = recipeRepository.save(recipe);

        // Maintain bidirectional relationship
        categories.forEach(category -> category.getRecipes().add(savedRecipe));

        return savedRecipe;
    }


    // ================================
    //  UPDATE RECIPE
    // ================================
    @Transactional
    public Recipe updateRecipe(Long id, RecipeCreateRequest req, User user) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + id + " not found"));

        if (!existing.getCreatedBy().getId().equals(user.getId()) && user.getUserType() != UserType.ADMIN) {
            throw new UnauthorizedActionException("You do not have permission to update this recipe");
        }

        validateRecipeRequest(req);

        // ✅ Load categories
        Set<Category> categories = new HashSet<>();
        if (req.getCategoryIds() != null && !req.getCategoryIds().isEmpty()) {
            categories = categoryRepository.findAllById(req.getCategoryIds()).stream().collect(Collectors.toSet());
            if (categories.size() != req.getCategoryIds().size()) {
                throw new InvalidRecipeDataException("One or more categories not found");
            }
        }

        // ✅ Load Existing Ingredients
        List<Ingredient> existingIngredients = ingredientsRepo.findByRecipe_Id(existing.getId());

        // ✅ Remove Old Ingredients Not in the New List
        existingIngredients.forEach(ingredient -> {
            boolean existsInNewList = req.getIngredients().stream()
                    .anyMatch(dto -> dto.getName().equals(ingredient.getName()));
            if (!existsInNewList) {
                ingredientsRepo.delete(ingredient); // Delete old ingredient
            }
        });

        // ✅ Add or Update Ingredients
        List<Ingredient> updatedIngredients = req.getIngredients().stream()
                .map(dto -> new Ingredient(dto.getName(), dto.getQuantity(), dto.getUnit(), existing))
                .collect(Collectors.toList());

        existing.getIngredients().clear(); // Ensure Hibernate handles relationships correctly
        existing.getIngredients().addAll(updatedIngredients);

        // ✅ Save Ingredients to Ensure They Persist
        ingredientsRepo.saveAll(updatedIngredients);

        // ✅ Update Recipe Fields
        existing.setTitle(req.getTitle());
        existing.setDescription(req.getDescription());
        existing.setPreparationSteps(req.getPreparationSteps());
        existing.setCookingTime(req.getCookingTime());
        existing.setServings(req.getServings());
        existing.setDietaryInfo(req.getDietaryInfo());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setContainsGluten(req.getContainsGlutenOrDefault());
        existing.setCategories(categories);

        // ✅ Ensure Recipe Updates Immediately
        return recipeRepository.saveAndFlush(existing);
    }


    // ================================
    //  VALIDATE RECIPE
    // ================================
    private void validateRecipeRequest(RecipeCreateRequest req) {
        if (req.getTitle() == null || req.getTitle().trim().isEmpty()) {
            throw new InvalidRecipeDataException("Recipe title cannot be empty");
        }
        if (req.getIngredients() == null || req.getIngredients().isEmpty()) {
            throw new InvalidRecipeDataException("Recipe must have at least one ingredient");
        }
        for (var ingredient : req.getIngredients()) {
            if (ingredient.getName() == null || ingredient.getName().trim().isEmpty() ||
                    ingredient.getQuantity() == null || ingredient.getQuantity().trim().isEmpty() ||
                    ingredient.getUnit() == null || ingredient.getUnit().trim().isEmpty()) {
                throw new InvalidRecipeDataException("Invalid ingredient entry");
            }
        }
        if (req.getCookingTime() <= 0) {
            throw new InvalidRecipeDataException("Cooking time must be greater than zero");
        }
        if (req.getServings() <= 0) {
            throw new InvalidRecipeDataException("Servings must be greater than zero");
        }
        if (req.getContainsGluten() == null) {
            req.setContainsGluten(true); // Defaulting to true if null
        }
    }

    // ================================
    //  MAP RECIPE -> RECIPE RESPONSE
    // ================================
    public RecipeResponse toRecipeResponse(Recipe recipe) {
        if (recipe == null) {
            throw new RecipeNotFoundException("Recipe is null or invalid");
        }
        // Extract category names from Recipe entity
        List<String> categoryNames = recipe.getCategories() != null
                ? recipe.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toList())
                : Collections.emptyList();

        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .ingredients(
                        recipe.getIngredients().stream()
                                .map(ingredient -> ingredient.getQuantity() + " " + ingredient.getUnit() + " of " + ingredient.getName())
                                .collect(Collectors.toList())
                )
                .preparationSteps(recipe.getPreparationSteps())
                .cookingTime(recipe.getCookingTime())
                .servings(recipe.getServings())
                .dietaryInfo(recipe.getDietaryInfo())
                .containsGluten(recipe.getContainsGluten())
                .status(recipe.getStatus() != null ? recipe.getStatus().name() : "UNKNOWN")
                .createdByUsername(recipe.getCreatedBy() != null ? recipe.getCreatedBy().getUsername() : "UNKNOWN")
                .photo(recipe.getPhotoAsBase64())
                .categories(categoryNames)
                .build();
    }

    // ================================
    //  GET RECIPE BY ID
    // ================================
    public Recipe getRecipeById(Long id) {
        return recipeRepository.findByIdWithCategories(id)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + id + " not found"));
    }

    // ================================
    //  GET RECIPES BY IDS (BATCH)
    // ================================
    @Transactional(readOnly = true)
    public List<RecipeResponse> getRecipesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        List<Recipe> recipes = recipeRepository.findAllById(ids);
        return recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

    // ================================
    //  SEARCH RECIPE BY TITLE
    // ================================
    public List<RecipeResponse> searchRecipesByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new InvalidRecipeDataException("Search title cannot be null or empty");
        }
        List<Recipe> recipes = recipeRepository.findByTitleContainingIgnoreCase(title);
        if (recipes.isEmpty()) {
            throw new RecipeNotFoundException("No recipes found with title containing: " + title);
        }
        return recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecipeResponse> getRecipesCreatedByUser(Long userId) {
        List<Recipe> recipes = recipeRepository.findByCreatedById(userId);
        // Convert each Recipe -> RecipeResponse
        return recipes.stream()
                .map(this::toRecipeResponse)
                .collect(Collectors.toList());
    }

}
