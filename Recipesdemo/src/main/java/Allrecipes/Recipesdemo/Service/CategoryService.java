package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Category;
import Allrecipes.Recipesdemo.Entities.Enums.FoodCategories;
import Allrecipes.Recipesdemo.Repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor // Lombok annotation to generate constructor for final fields
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    /**
     * Retrieves a category by its name.
     *
     * @param name The name of the category.
     * @return The Category object if found, else null.
     */
    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        logger.debug("Fetching category with name: {}", name);
        return categoryRepository.findByName(name).orElse(null);
    }

    /**
     * Creates a new category based on the provided FoodCategories enum.
     *
     * @param foodCategory The FoodCategories enum representing the category.
     * @return The created or existing Category object.
     */
    @Transactional
    public Category createCategory(FoodCategories foodCategory) {
        String categoryName = foodCategory.name();
        logger.debug("Creating or fetching category with name: {}", categoryName);
        return categoryRepository.findByName(categoryName)
                .orElseGet(() -> {
                    Category category = Category.builder()
                            .name(categoryName)
                            .foodCategory(foodCategory)
                            .build();
                    Category savedCategory = categoryRepository.save(category);
                    logger.info("Created new category with ID: {}", savedCategory.getId());
                    return savedCategory;
                });
    }

    /**
     * Retrieves all categories.
     *
     * @return A list of all Category objects.
     */
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        logger.debug("Fetching all categories.");
        return categoryRepository.findAll();
    }

    /**
     * Searches for categories containing the specified keyword in their name, case-insensitive.
     *
     * @param keyword The keyword to search for.
     * @return A list of matching Category objects.
     */
    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String keyword) {
        logger.debug("Searching categories with keyword: {}", keyword);
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }

    /**
     * Retrieves all categories sorted by their name in ascending order.
     *
     * @return A list of sorted Category objects.
     */
    @Transactional(readOnly = true)
    public List<Category> getCategoriesSortedByName() {
        logger.debug("Fetching all categories sorted by name in ascending order.");
        return categoryRepository.findAllByOrderByNameAsc();
    }

    /**
     * Checks if a category exists by its name.
     *
     * @param name The name of the category.
     * @return True if the category exists, else false.
     */
    @Transactional(readOnly = true)
    public boolean categoryExists(String name) {
        logger.debug("Checking existence of category with name: {}", name);
        return categoryRepository.existsByName(name);
    }

    /**
     * Deletes a category by its name.
     *
     * @param name The name of the category to delete.
     * @throws IllegalArgumentException If the category does not exist.
     */
    @Transactional
    public void deleteCategoryByName(String name) {
        logger.debug("Attempting to delete category with name: {}", name);
        if (categoryExists(name)) {
            categoryRepository.deleteByName(name);
            logger.info("Deleted category with name: {}", name);
        } else {
            logger.error("Category with name {} does not exist.", name);
            throw new IllegalArgumentException("Category with name " + name + " does not exist.");
        }
    }

    /**
     * Retrieves categories by their IDs.
     *
     * @param ids A list of category IDs.
     * @return A list of matching Category objects.
     */
    @Transactional(readOnly = true)
    public List<Category> getCategoriesByIds(List<Long> ids) {
        logger.debug("Fetching categories with IDs: {}", ids);
        return categoryRepository.findByIdIn(ids);
    }
}
