package Allrecipes.Recipesdemo.Testing;

import Allrecipes.Recipesdemo.Entities.User;
import Allrecipes.Recipesdemo.Entities.Category;
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

import java.time.LocalDateTime;
import java.util.List;

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

    @Override
    public void run(String... args) {
        System.out.println("\n======== Customer Tester ========\n");

        try {
            addCustomers();
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
        }
    }

    private void addTestRecipes() {
        System.out.println("\n===== Adding Test Recipes =====");

        try {
            // Adding categories
            Category vegetarianCategory = categoryService.createCategory(FoodCategories.VEGETARIAN);

            // First test recipe
            RecipeCreateRequest recipeRequest1 = RecipeCreateRequest.builder()
                    .title("Test Recipe 1")
                    .description("A simple test recipe 1.")
                    .ingredients(List.of(
                            new IngredientRequest("Ingredient 1", "2", "cups"),
                            new IngredientRequest("Ingredient 2", "1", "tsp")
                    ))
                    .preparationSteps("Step 1: Do this. Step 2: Do that.")
                    .cookingTime(30)
                    .servings(4)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(false)
                    .build();

            testRecipe = recipeService.createRecipe(recipeRequest1, customer1);
            System.out.println("Added Test Recipe 1: " + testRecipe);

        } catch (Exception e) {
            System.err.println("Error adding recipes: " + e.getMessage());
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
        }
    }

    private void printAllCustomers() {
        System.out.println("\n===== Fetching All Customers =====");

        List<User> customers = customerService.getAllUsers();
        if (customers.isEmpty()) {
            System.out.println("No customers found.");
        } else {
            customers.forEach(customer -> System.out.println("Customer: " + customer));
        }
    }
}
