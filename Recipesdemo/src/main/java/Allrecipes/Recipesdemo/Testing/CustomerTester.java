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
            initializeCategories();
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
            Long BeefCategoryId = categoryService.getCategoryByName(FoodCategories.BEEF.name()).getId();
            Long mexicanCategoryId = categoryService.getCategoryByName(FoodCategories.MEXICAN.name()).getId();
            Long appetizerCategoryId = categoryService.getCategoryByName(FoodCategories.APPETIZER.name()).getId();
            Long saladCategoryId = categoryService.getCategoryByName(FoodCategories.SALAD.name()).getId();
            Long mainCourseCategoryId = categoryService.getCategoryByName(FoodCategories.MAIN_COURSE.name()).getId();
            Long beverageCategoryId = categoryService.getCategoryByName(FoodCategories.BEVERAGE.name()).getId();
            Long snackCategoryId = categoryService.getCategoryByName(FoodCategories.SNACK.name()).getId();
            Long soupCategoryId = categoryService.getCategoryByName(FoodCategories.SOUP.name()).getId();
            // Recipe 1
            RecipeCreateRequest recipeRequest1 = RecipeCreateRequest.builder()
                    .title("Classic Pancakes")
                    .description("Fluffy and delicious pancakes perfect for breakfast.")
                    .ingredients(List.of(
                            new IngredientRequest("Flour", "2", "cups"),
                            new IngredientRequest("Granulated sugar ", "1.5", "tbsp"),
                            new IngredientRequest("Salt ", "1.5", "tsp"),
                            new IngredientRequest("Unsalted butter ", "3", "tbsp"),
                            new IngredientRequest("Milk", "1.5", "cups"),
                            new IngredientRequest("Eggs", "2", "large"),
                            new IngredientRequest("Vanilla extract ", "1", "tsp "),
                            new IngredientRequest("Baking Powder", "2", "tsp")
                    ))
                    .preparationSteps("Mix dry ingredients, add wet ingredients, and cook on a griddle.")
                    .cookingTime(20)
                    .servings(4)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(true)
                    .categoryIds(Set.of(vegetarianCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Classic Pancakes.jpg"))

                    .build();

            testRecipe = recipeService.createRecipe(recipeRequest1, customer1);
            System.out.println("Added Recipe 1: " + testRecipe);

            // Recipe 2
            RecipeCreateRequest recipeRequest2 = RecipeCreateRequest.builder()
                    .title("Chocolate Lava Cake")
                    .description("A decadent dessert with a gooey chocolate center.")
                    .ingredients(List.of(
                            new IngredientRequest("Dark Chocolate", "200", "grams"),
                            new IngredientRequest("Unsalted butter ", "100", "grams"),
                            new IngredientRequest("Powdered sugar ", "1", "cup"),
                            new IngredientRequest("All-purpose flour  ", "2", "cup"),
                            new IngredientRequest("Vanilla extract", "2", "tsp"),
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
                            new IngredientRequest("Butter", "50", "grams"),
                            new IngredientRequest("Unsalted butter", "3", "tbsp"),
                            new IngredientRequest("Olive oil ", "1", "tbsp"),
                            new IngredientRequest("Salt ", "1", "tbsp"),
                            new IngredientRequest("Black pepper  ", "1", "tbsp"),
                            new IngredientRequest("Garlic", "4", "cloves"),
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

            RecipeCreateRequest recipeRequest8 = RecipeCreateRequest.builder()
                    .title("Mexican Tacos")
                    .description("Delicious Mexican-style tacos with seasoned beef, fresh veggies, and spicy salsa.")
                    .ingredients(List.of(
                            new IngredientRequest("Ground Beef", "500", "grams"),
                            new IngredientRequest("Taco Shells", "10", "pieces"),
                            new IngredientRequest("Lettuce", "1", "cup"),
                            new IngredientRequest("Tomato", "2", "diced"),
                            new IngredientRequest("Cheddar Cheese", "1", "cup"),
                            new IngredientRequest("Salsa", "1/2", "cup")
                    ))
                    .preparationSteps("Cook the beef with spices, assemble tacos with toppings, and serve.")
                    .cookingTime(15)
                    .servings(4)
                    .dietaryInfo("Main Dish")
                    .containsGluten(true)
                    .categoryIds(Set.of(mexicanCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Mexican+Tacos.jpg"))
                    .build();

            Recipe tacosRecipe = recipeService.createRecipe(recipeRequest8, customer1);
            System.out.println("Added Recipe 8: " + tacosRecipe);

            // Recipe 9: Beef Steak Avocado Salad
            RecipeCreateRequest recipeRequest9 = RecipeCreateRequest.builder()
                    .title("Beef Steak ")
                    .description("A protein-packed salad with juicy beef steak,")
                    .ingredients(List.of(
                            new IngredientRequest("Beef Steak", "300", "grams"),
                            new IngredientRequest("Cherry Tomatoes", "1", "cup"),
                            new IngredientRequest("Butter ", "1", "tbsp"),
                            new IngredientRequest("Freshly ground black pepper ", "2", "tbsp"),
                            new IngredientRequest("Olive Oil", "2", "tbsp"),
                            new IngredientRequest("Coarse salt ", "2", "tbsp"),
                            new IngredientRequest("Balsamic Vinegar", "1", "tbsp")
                    ))
                    .preparationSteps("Grill steak to desired doneness, Internal Temperature: 120°F - 125°F (49°C - 52°C)")
                    .cookingTime(30)
                    .servings(2)
                    .dietaryInfo("Main Dish")
                    .containsGluten(false)
                    .categoryIds(Set.of(BeefCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/steak.jpg"))
                    .build();

            Recipe steakSaladRecipe = recipeService.createRecipe(recipeRequest9, customer2);
            System.out.println("Added Recipe 9: " + steakSaladRecipe);

            // Recipe 10: Chicken and Avocado
            RecipeCreateRequest recipeRequest10 = RecipeCreateRequest.builder()
                    .title("Chicken and Avocado")
                    .description("A quick and healthy dish with grilled chicken and creamy avocado slices.")
                    .ingredients(List.of(
                            new IngredientRequest("Chicken Breast", "2", "pieces"),
                            new IngredientRequest("Avocado", "1", "sliced"),
                            new IngredientRequest("Lime Juice", "1", "tbsp"),
                            new IngredientRequest("Garlic Powder", "1", "tsp"),
                            new IngredientRequest("Salt", "1/2", "tsp"),
                            new IngredientRequest("Black Pepper", "1/2", "tsp")
                    ))
                    .preparationSteps("Season chicken, grill until golden, and serve with avocado slices.")
                    .cookingTime(20)
                    .servings(2)
                    .dietaryInfo("Main Dish")
                    .containsGluten(false)
                    .categoryIds(Set.of(saladCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/Chicken-and-Avocado.jpg"))
                    .build();

            Recipe chickenAvocadoRecipe = recipeService.createRecipe(recipeRequest10, customer1);
            System.out.println("Added Recipe 10: " + chickenAvocadoRecipe);

            // Recipe 11: Appetizer - Stuffed Mushrooms
            RecipeCreateRequest recipeRequest11 = RecipeCreateRequest.builder()
                    .title("Stuffed Mushrooms")
                    .description("Juicy mushrooms stuffed with a cheesy herb filling, perfect for an appetizer.")
                    .ingredients(List.of(
                            new IngredientRequest("Button Mushrooms", "12", "pieces"),
                            new IngredientRequest("Cream Cheese", "100", "grams"),
                            new IngredientRequest("Garlic", "2", "cloves"),
                            new IngredientRequest("Parsley", "2", "tbsp"),
                            new IngredientRequest("Parmesan Cheese", "50", "grams")
                    ))
                    .preparationSteps("Clean mushrooms, remove stems, mix filling ingredients, stuff mushrooms, and bake at 180°C for 15 minutes.")
                    .cookingTime(15)
                    .servings(4)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(false)
                    .categoryIds(Set.of(appetizerCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/StuffedMushrooms.jpg"))
                    .build();

            Recipe stuffedMushroomsRecipe = recipeService.createRecipe(recipeRequest11, customer2);
            System.out.println("Added Recipe 11: " + stuffedMushroomsRecipe);

            // Recipe 12: Main Course - Herb-Crusted Chicken
            RecipeCreateRequest recipeRequest12 = RecipeCreateRequest.builder()
                    .title("Herb-Crusted Chicken")
                    .description("Juicy chicken breast coated in a flavorful herb crust.")
                    .ingredients(List.of(
                            new IngredientRequest("Chicken Breast", "2", "pieces"),
                            new IngredientRequest("Breadcrumbs", "1", "cup"),
                            new IngredientRequest("Parsley", "2", "tbsp"),
                            new IngredientRequest("Garlic Powder", "1", "tsp"),
                            new IngredientRequest("Salt", "1", "tsp")
                    ))
                    .preparationSteps("Coat chicken in herb mixture, bake at 200°C for 25 minutes.")
                    .cookingTime(25)
                    .servings(2)
                    .dietaryInfo("Main Course")
                    .containsGluten(true)
                    .categoryIds(Set.of(mainCourseCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/HerbCrustedChicken.jpg"))
                    .build();

            Recipe herbCrustedChickenRecipe = recipeService.createRecipe(recipeRequest12, customer1);
            System.out.println("Added Recipe 12: " + herbCrustedChickenRecipe);

            // Recipe 13: Beverage - Fresh Lemonade
            RecipeCreateRequest recipeRequest13 = RecipeCreateRequest.builder()
                    .title("Fresh Lemonade")
                    .description("Refreshing homemade lemonade with a hint of mint.")
                    .ingredients(List.of(
                            new IngredientRequest("Lemon Juice", "1/2", "cup"),
                            new IngredientRequest("Water", "4", "cups"),
                            new IngredientRequest("Ice cubes ", "4", "pieces"),
                            new IngredientRequest("Lemon slices  ", "4", "pieces"),
                            new IngredientRequest("Sugar", "1/4", "cup"),
                            new IngredientRequest("Mint Leaves", "5", "leaves")
                    ))
                    .preparationSteps("Mix ingredients, chill, and serve over ice.")
                    .cookingTime(5)
                    .servings(4)
                    .dietaryInfo("Beverage")
                    .containsGluten(false)
                    .categoryIds(Set.of(beverageCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/FreshLemonade.jpg"))
                    .build();

            Recipe freshLemonadeRecipe = recipeService.createRecipe(recipeRequest13, customer1);
            System.out.println("Added Recipe 13: " + freshLemonadeRecipe);

            // Recipe 14: Snack - Cheesy Nachos
            RecipeCreateRequest recipeRequest14 = RecipeCreateRequest.builder()
                    .title("Cheesy Nachos")
                    .description("Crispy tortilla chips topped with melted cheese and jalapeños.")
                    .ingredients(List.of(
                            new IngredientRequest("Tortilla Chips", "200", "grams"),
                            new IngredientRequest("Cheddar Cheese", "1", "cup"),
                            new IngredientRequest("Jalapeños", "1/4", "cup"),
                            new IngredientRequest("Sour Cream", "1/2", "cup")
                    ))
                    .preparationSteps("Layer chips with cheese and jalapeños, bake at 180°C for 10 minutes, serve with sour cream.")
                    .cookingTime(10)
                    .servings(2)
                    .dietaryInfo("Snack")
                    .containsGluten(false)
                    .categoryIds(Set.of(snackCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/CheesyNachos.jpg"))
                    .build();

            Recipe cheesyNachosRecipe = recipeService.createRecipe(recipeRequest14, customer2);
            System.out.println("Added Recipe 14: " + cheesyNachosRecipe);

            // Recipe 15: Soup - Creamy Tomato Soup
            RecipeCreateRequest recipeRequest15 = RecipeCreateRequest.builder()
                    .title("Creamy Tomato Soup")
                    .description("A warm and comforting tomato soup with a creamy texture.")
                    .ingredients(List.of(
                            new IngredientRequest("Tomatoes", "6", "large"),
                            new IngredientRequest("Onion", "1", "large"),
                            new IngredientRequest("Heavy Cream", "1/2", "cup"),
                            new IngredientRequest("Vegetable Broth", "2", "cups"),
                            new IngredientRequest("Garlic", "2", "cloves")
                    ))
                    .preparationSteps("Cook tomatoes and onion, blend with broth and cream, simmer for 10 minutes.")
                    .cookingTime(20)
                    .servings(4)
                    .dietaryInfo("Soup")
                    .containsGluten(false)
                    .categoryIds(Set.of(soupCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/CreamyTomatoSoup.jpg"))
                    .build();

            Recipe creamyTomatoSoupRecipe = recipeService.createRecipe(recipeRequest15, customer1);
            System.out.println("Added Recipe 15: " + creamyTomatoSoupRecipe);



            // Recipe 16: Gourmet Pizza
            RecipeCreateRequest recipeRequest16 = RecipeCreateRequest.builder()
                    .title("Gourmet Pizza")
                    .description("A handcrafted pizza loaded with artisanal ingredients and a crispy crust.")
                    .ingredients(List.of(
                            new IngredientRequest("Pizza Dough", "1", "lb"),
                            new IngredientRequest("Tomato Sauce", "1/2", "cup"),
                            new IngredientRequest("Mozzarella Cheese", "200", "grams"),
                            new IngredientRequest("Fresh Basil", "1/4", "cup"),
                            new IngredientRequest("Olive Oil", "2", "tbsp"),
                            new IngredientRequest("Cherry Tomatoes", "10", "pieces")
                    ))
                    .preparationSteps("Spread sauce on the dough, add cheese and toppings, and bake at 475°F for about 12 minutes.")
                    .cookingTime(20)
                    .servings(2)
                    .dietaryInfo("Vegetarian")
                    .containsGluten(true)
                    .categoryIds(Set.of(mainCourseCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/GourmetPizza.jpg"))
                    .build();

            Recipe gourmetPizzaRecipe = recipeService.createRecipe(recipeRequest16, customer1);
            System.out.println("Added Recipe 16: " + gourmetPizzaRecipe);

            // Recipe 17: Juicy Burger
            RecipeCreateRequest recipeRequest17 = RecipeCreateRequest.builder()
                    .title("Juicy Burger")
                    .description("A perfectly grilled burger featuring a juicy beef patty with fresh lettuce, tomato, and melted cheese.")
                    .ingredients(List.of(
                            new IngredientRequest("Ground Beef", "500", "grams"),
                            new IngredientRequest("Burger Buns", "4", "pieces"),
                            new IngredientRequest("Lettuce", "4", "leaves"),
                            new IngredientRequest("Tomato", "1", "sliced"),
                            new IngredientRequest("Cheddar Cheese", "4", "slices"),
                            new IngredientRequest("Onion", "1", "sliced"),
                            new IngredientRequest("Pickles", "8", "slices"),
                            new IngredientRequest("Ketchup", "2", "tbsp"),
                            new IngredientRequest("Mustard", "2", "tbsp")
                    ))
                    .preparationSteps("Form patties, grill them to your desired doneness, and assemble with buns and toppings.")
                    .cookingTime(15)
                    .servings(4)
                    .dietaryInfo("Main Dish")
                    .containsGluten(true)
                    .categoryIds(Set.of(BeefCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/JuicyBurger.jpg"))
                    .build();

            Recipe juicyBurgerRecipe = recipeService.createRecipe(recipeRequest17, customer2);
            System.out.println("Added Recipe 17: " + juicyBurgerRecipe);

            // Recipe 18: Decadent Dessert
            RecipeCreateRequest recipeRequest18 = RecipeCreateRequest.builder()
                    .title("Decadent Dessert")
                    .description("An indulgent dessert featuring rich chocolate layers and a velvety ganache.")
                    .ingredients(List.of(
                            new IngredientRequest("Dark Chocolate", "300", "grams"),
                            new IngredientRequest("Heavy Cream", "1", "cup"),
                            new IngredientRequest("Butter", "50", "grams"),
                            new IngredientRequest("Sugar", "1/2", "cup"),
                            new IngredientRequest("Vanilla Extract", "1", "tsp")
                    ))
                    .preparationSteps("Melt chocolate with butter, mix in the cream and sugar, then chill until set.")
                    .cookingTime(30)
                    .servings(4)
                    .dietaryInfo("Dessert")
                    .containsGluten(false)
                    .categoryIds(Set.of(dessertCategoryId))
                    .photo(encodeImageToBase64("src/main/resources/images/recipes/DecadentDessert.jpg"))
                    .build();

            Recipe decadentDessertRecipe = recipeService.createRecipe(recipeRequest18, customer1);
            System.out.println("Added Recipe 18: " + decadentDessertRecipe);


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
