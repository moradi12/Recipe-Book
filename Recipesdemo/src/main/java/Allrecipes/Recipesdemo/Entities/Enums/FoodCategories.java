package Allrecipes.Recipesdemo.Entities.Enums;

import lombok.Getter;

@Getter
public enum FoodCategories {

    // Types of meals
    APPETIZER("Appetizer"),
    MAIN_COURSE("Main Course"),
    DESSERT("Dessert"),
    BEVERAGE("Beverage"),
    SNACK("Snack"),
    SALAD("Salad"),
    SOUP("Soup"),
    BREAD("Bread"),
    BREAKFAST("Breakfast"),
    SEAFOOD("Seafood"),

    // Dietary preferences
    VEGETARIAN("Vegetarian"),
    VEGAN("Vegan"),
    GLUTEN_FREE("Gluten Free"),
    KETO("Keto"),
    PALEO("Paleo");

    private final String description;

    FoodCategories(String description) {
        this.description = description;
    }
}
