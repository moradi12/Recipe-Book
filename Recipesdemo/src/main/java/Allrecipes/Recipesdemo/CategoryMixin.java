package Allrecipes.Recipesdemo;

import Allrecipes.Recipesdemo.Recipe.Recipe;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public abstract class CategoryMixin {
    @JsonIgnore
    abstract List<Recipe> getRecipes();
}
