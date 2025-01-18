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
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        logger.debug("Fetching category with name: {}", name);
        return categoryRepository.findByName(name).orElse(null);
    }

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


    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        logger.debug("Fetching all categories.");
        return categoryRepository.findAll();
    }


    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String keyword) {
        logger.debug("Searching categories with keyword: {}", keyword);
        return categoryRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesSortedByName() {
        logger.debug("Fetching all categories sorted by name in ascending order.");
        return categoryRepository.findAllByOrderByNameAsc();
    }


    @Transactional(readOnly = true)
    public boolean categoryExists(String name) {
        logger.debug("Checking existence of category with name: {}", name);
        return categoryRepository.existsByName(name);
    }

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

    @Transactional(readOnly = true)
    public List<Category> getCategoriesByIds(List<Long> ids) {
        logger.debug("Fetching categories with IDs: {}", ids);
        return categoryRepository.findByIdIn(ids);
    }
}
