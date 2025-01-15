package Allrecipes.Recipesdemo.Testing;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.Comment;
import Allrecipes.Recipesdemo.Entities.Enums.FoodCategories;
import Allrecipes.Recipesdemo.Entities.Favorite;
import Allrecipes.Recipesdemo.Request.IngredientRequest;
import Allrecipes.Recipesdemo.Rating.RatingResponse;
import Allrecipes.Recipesdemo.Request.RatingCreateRequest;
import Allrecipes.Recipesdemo.Request.RecipeCreateRequest;
import Allrecipes.Recipesdemo.Service.*;
import Allrecipes.Recipesdemo.Recipe.Recipe;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Component
@Order(7)
public class CustomerTester implements CommandLineRunner {

    private final CustomerService customerService;
    private final CommentService commentService;
    private final RatingService ratingService;
    private final RecipeService recipeService;
    private final CategoryService categoryService;
    private final FavoriteService favoriteService;

    private User customer1;
    private User customer2;
    private Recipe testRecipe;
    private String encodeImageToBase64(String filePath) {
        try {
            byte[] fileContent = Files.readAllBytes(Paths.get(filePath));
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (Exception e) {
            System.err.println("Error encoding image: " + e.getMessage());
            return null;
        }
    }

    @Override

    public void run(String... args) {
        System.out.println("\n======== Customer Tester ========\n");

        try {
            addCustomers();
            initializeCategories(); // Ensure categories are initialized
            addTestRecipes();

            if (testRecipe == null) {
                System.err.println("Test recipe not created. Skipping dependent tests.");
                return;
            }

            printAllCustomers();
            testFavorites();
            testComments();
            testRatings();
        } catch (Exception e) {
            System.err.println("An error occurred in CustomerTester: " + e.getMessage());
            e.printStackTrace(); // For detailed stack trace
        }
    }

    private void addCustomers() {
        System.out.println("\n===== Adding New Customers =====");

        try {
            customer1 = customerService.registerUser("johnDoe", "john.doe@example.com", "password123");
            System.out.println("Added Customer 1: " + customer1);

            customer2 = customerService.registerUser("janeSmith", "jane.smith@example.com", "securePass456");
            System.out.println("Added Customer 2: " + customer2);

            User customer3 = customerService.registerUser("emilyClark", "emily.clark@example.com", "Emily123");
            System.out.println("Added Customer 3: " + customer3);

            User customer4 = customerService.registerUser("michaelBrown", "michael.brown@example.com", "Brown456");
            System.out.println("Added Customer 4: " + customer4);

            User customer5 = customerService.registerUser("sarahJones", "sarah.jones@example.com", "Jones789");
            System.out.println("Added Customer 5: " + customer5);

        } catch (Exception e) {
            System.err.println("Error adding customers: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initializeCategories() {
        System.out.println("\n===== Initializing Categories =====");

        try {
            for (FoodCategories foodCategory : FoodCategories.values()) {
                Category category = categoryService.createCategory(foodCategory);
                System.out.println("Initialized Category: " + category);
            }
        } catch (Exception e) {
            System.err.println("Error initializing categories: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void addTestRecipes() {
        System.out.println("\n===== Adding Test Recipes =====");

        try {
            // Fetch category IDs by category names
            Long vegetarianCategoryId = categoryService.getCategoryByName(FoodCategories.VEGETARIAN.name()).getId();
            Long dessertCategoryId = categoryService.getCategoryByName(FoodCategories.DESSERT.name()).getId();
            Long seafoodCategoryId = categoryService.getCategoryByName(FoodCategories.SEAFOOD.name()).getId();
            Long veganCategoryId = categoryService.getCategoryByName(FoodCategories.VEGAN.name()).getId();
            Long breakfastCategoryId = categoryService.getCategoryByName(FoodCategories.BREAKFAST.name()).getId();

            // Recipe 1
            RecipeCreateRequest recipeRequest1 = RecipeCreateRequest.builder()
                    .title("Classic Pancakes")
                    .description("Fluffy and delicious pancakes perfect for breakfast.")
                    .ingredients(List.of(
                            new IngredientRequest("Flour", "2", "cups"),
                            new IngredientRequest("Milk", "1.5", "cups"),
                            new IngredientRequest("Eggs", "2", "large"),
                            new IngredientRequest("Baking Powder", "2", "tsp")
                    ))
                    .preparationSteps("Mix dry ingredients, add wet ingredients, and cook on a griddle.")
                    .cookingTime(20)
                    .servings(4)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(true)
                    .categoryIds(Set.of(vegetarianCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Classic Pancakes.jpg")) // Set Base64 photo

                    .build();

            testRecipe = recipeService.createRecipe(recipeRequest1, customer1);
            System.out.println("Added Recipe 1: " + testRecipe);

            // Recipe 2
            RecipeCreateRequest recipeRequest2 = RecipeCreateRequest.builder()
                    .title("Chocolate Lava Cake")
                    .description("A decadent dessert with a gooey chocolate center.")
                    .ingredients(List.of(
                            new IngredientRequest("Dark Chocolate", "200", "grams"),
                            new IngredientRequest("Butter", "100", "grams"),
                            new IngredientRequest("Sugar", "1", "cup"),
                            new IngredientRequest("Eggs", "3", "large")
                    ))
                    .preparationSteps("Melt chocolate and butter, mix with other ingredients, and bake.")
                    .cookingTime(15)
                    .servings(2)
                    .dietaryInfo("Dessert")
                    .containsGluten(false)
                    .categoryIds(Set.of(dessertCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/LavaCake.jpg")) // Set Base64 photo

                    .build();

            Recipe lavaCakeRecipe = recipeService.createRecipe(recipeRequest2, customer2);
            System.out.println("Added Recipe 2: " + lavaCakeRecipe);

            // Recipe 3
            RecipeCreateRequest recipeRequest3 = RecipeCreateRequest.builder()
                    .title("Garlic Butter Shrimp")
                    .description("Succulent shrimp cooked in a garlic butter sauce.")
                    .ingredients(List.of(
                            new IngredientRequest("Shrimp", "500", "grams"),
                            new IngredientRequest("Garlic", "4", "cloves"),
                            new IngredientRequest("Butter", "50", "grams"),
                            new IngredientRequest("Parsley", "2", "tbsp")
                    ))
                    .preparationSteps("Saute garlic in butter, add shrimp, and cook until done.")
                    .cookingTime(10)
                    .servings(4)
                    .dietaryInfo("Seafood")
                    .containsGluten(false)
                    .categoryIds(Set.of(seafoodCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/ButterShrimp.jpg")) // Set Base64 photo
                    .build();

            Recipe shrimpRecipe = recipeService.createRecipe(recipeRequest3, customer1);
            System.out.println("Added Recipe 3: " + shrimpRecipe);

            // Recipe 4
            RecipeCreateRequest recipeRequest4 = RecipeCreateRequest.builder()
                    .title("Vegan Buddha Bowl")
                    .description("A healthy and colorful vegan meal bowl.")
                    .ingredients(List.of(
                            new IngredientRequest("Quinoa", "1", "cup"),
                            new IngredientRequest("Chickpeas", "1", "can"),
                            new IngredientRequest("Avocado", "1", "sliced"),
                            new IngredientRequest("Spinach", "2", "cups")
                    ))
                    .preparationSteps("Cook quinoa, add toppings, and drizzle with tahini sauce.")
                    .cookingTime(25)
                    .servings(2)
                    .dietaryInfo("Vegan")
                    .containsGluten(false)
                    .categoryIds(Set.of(veganCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/BuddhaBowl.jpg")) // Set Base64 photo

                    .build();

            Recipe buddhaBowlRecipe = recipeService.createRecipe(recipeRequest4, customer2);
            System.out.println("Added Recipe 4: " + buddhaBowlRecipe);

            // Recipe 5
            RecipeCreateRequest recipeRequest5 = RecipeCreateRequest.builder()
                    .title("Egg and Avocado Toast")
                    .description("A quick and nutritious breakfast option.")
                    .ingredients(List.of(
                            new IngredientRequest("Whole Grain Bread", "2", "slices"),
                            new IngredientRequest("Avocado", "1", "mashed"),
                            new IngredientRequest("Eggs", "2", "poached"),
                            new IngredientRequest("Lemon Juice", "1", "tsp")
                    ))
                    .preparationSteps("Toast bread, spread avocado, add eggs, and drizzle with lemon juice.")
                    .cookingTime(10)
                    .servings(1)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(true)
                    .categoryIds(Set.of(breakfastCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/EggandAvocado.jpg"))
                    .build();

            Recipe avocadoToastRecipe = recipeService.createRecipe(recipeRequest5, customer1);
            System.out.println("Added Recipe 5: " + avocadoToastRecipe);

            // Recipe 6
            RecipeCreateRequest recipeRequest6 = RecipeCreateRequest.builder()
                    .title("Grilled Salmon with Dill Sauce")
                    .description("Perfectly grilled salmon served with a creamy dill sauce.")
                    .ingredients(List.of(
                            new IngredientRequest("Salmon Fillets", "2", "pieces"),
                            new IngredientRequest("Dill", "1", "tbsp"),
                            new IngredientRequest("Yogurt", "1/2", "cup"),
                            new IngredientRequest("Lemon", "1", "sliced")
                    ))
                    .preparationSteps("Grill salmon, mix sauce ingredients, and serve together.")
                    .cookingTime(15)
                    .servings(2)
                    .dietaryInfo("Seafood")
                    .containsGluten(false)
                    .categoryIds(Set.of(seafoodCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Salmon.jpg"))

                    .build();

            Recipe salmonRecipe = recipeService.createRecipe(recipeRequest6, customer2);
            System.out.println("Added Recipe 6: " + salmonRecipe);

            // Recipe 7
            RecipeCreateRequest recipeRequest7 = RecipeCreateRequest.builder()
                    .title("Spaghetti Aglio e Olio")
                    .description("A classic Italian pasta dish with garlic and olive oil.")
                    .ingredients(List.of(
                            new IngredientRequest("Spaghetti", "200", "grams"),
                            new IngredientRequest("Garlic", "6", "cloves"),
                            new IngredientRequest("Olive Oil", "1/4", "cup"),
                            new IngredientRequest("Red Pepper Flakes", "1", "tsp")
                    ))
                    .preparationSteps("Cook spaghetti, saute garlic in olive oil, and toss together.")
                    .cookingTime(20)
                    .servings(2)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(true)
                    .categoryIds(Set.of(vegetarianCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Spaghetti.jpg"))
                    .build();

            Recipe pastaRecipe = recipeService.createRecipe(recipeRequest7, customer1);
            System.out.println("Added Recipe 7: " + pastaRecipe);

        } catch (Exception e) {
            System.err.println("Error adding recipes: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void testComments() {
        System.out.println("\n===== Testing Comments =====");

        try {
            if (testRecipe == null) {
                System.err.println("Test recipe not initialized. Skipping comments test.");
                return;
            }

            Comment comment1 = Comment.builder()
                    .text("Amazing recipe!")
                    .user(customer1)
                    .recipe(testRecipe)
                    .createdAt(LocalDateTime.now())
                    .build();
            commentService.createComment(comment1);
            System.out.println("Created Comment: " + comment1);

            List<Comment> comments = commentService.getCommentsByRecipeId(testRecipe.getId());
            System.out.println("Comments for Recipe:");
            comments.forEach(comment -> System.out.println(" - " + comment.getText() + " | By: " + comment.getUser().getUsername()));

        } catch (Exception e) {
            System.err.println("Error testing comments: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void testFavorites() {
        System.out.println("\n===== Testing Favorites =====");

        try {
            if (testRecipe == null) {
                System.err.println("Test recipe not initialized. Skipping favorites test.");
                return;
            }

            Favorite favorite1 = favoriteService.addFavorite(customer1, testRecipe);
            System.out.println("Added Favorite 1: " + favorite1);

        } catch (Exception e) {
            System.err.println("Error testing favorites: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void testRatings() {
        System.out.println("\n===== Testing Ratings =====");

        try {
            if (testRecipe == null) {
                System.err.println("Test recipe not initialized. Skipping ratings test.");
                return;
            }

            RatingCreateRequest ratingRequest1 = RatingCreateRequest.builder()
                    .recipeId(testRecipe.getId())
                    .userId(customer1.getId())
                    .score(5)
                    .comment("Absolutely fantastic!")
                    .build();

            RatingResponse createdRating1 = ratingService.createRating(ratingRequest1);
            System.out.println("Created Rating: " + createdRating1);

        } catch (Exception e) {
            System.err.println("Error testing ratings: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void printAllCustomers() {
        System.out.println("\n===== Fetching All Customers =====");

        try {
            List<User> customers = customerService.getAllUsers();
            if (customers.isEmpty()) {
                System.out.println("No customers found.");
            } else {
                customers.forEach(customer -> System.out.println("Customer: " + customer));
            }
        } catch (Exception e) {
            System.err.println("Error fetching customers: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
