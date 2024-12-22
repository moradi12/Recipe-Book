// src/components/RecipesPage/RecipesPage.tsx
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styles from './RecipesPage.module.css';

interface Recipe {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

const RecipesPage: React.FC = () => {
  const [recipes] = useState<Recipe[]>([
    {
      id: 1,
      name: 'Spaghetti with Meatballs',
      description:
        'A classic Italian pasta dish with flavorful meatballs and rich tomato sauce.',
      image: 'https://via.placeholder.com/300?text=Spaghetti+with+Meatballs',
      category: 'Italian',
    },
    {
      id: 2,
      name: 'Chicken Tikka Masala',
      description:
        'Marinated chicken cooked in a creamy spiced curry sauce.',
      image: 'https://via.placeholder.com/300?text=Chicken+Tikka+Masala',
      category: 'Asian',
    },
    {
      id: 3,
      name: 'Avocado Toast',
      description:
        'A simple breakfast favorite made with fresh avocados, lemon juice, and spices.',
      image: 'https://via.placeholder.com/300?text=Avocado+Toast',
      category: 'Vegan',
    },
    {
      id: 4,
      name: 'Vegan Buddha Bowl',
      description:
        'A nourishing bowl filled with quinoa, roasted vegetables, and tahini dressing.',
      image: 'https://via.placeholder.com/300?text=Vegan+Buddha+Bowl',
      category: 'Vegan',
    },
    {
      id: 5,
      name: 'Beef Stir Fry',
      description:
        'Tender beef strips stir-fried with fresh vegetables in a savory sauce.',
      image: 'https://via.placeholder.com/300?text=Beef+Stir+Fry',
      category: 'Asian',
    },
    {
      id: 6,
      name: 'Tiramisu',
      description:
        'An Italian dessert made with coffee-soaked ladyfingers layered with mascarpone cheese.',
      image: 'https://via.placeholder.com/300?text=Tiramisu',
      category: 'Desserts',
    },
    {
      id: 7,
      name: 'Margherita Pizza',
      description:
        'Classic pizza topped with fresh tomatoes, mozzarella, and basil.',
      image: 'https://via.placeholder.com/300?text=Margherita+Pizza',
      category: 'Italian',
    },
    {
      id: 8,
      name: 'Chocolate Lava Cake',
      description:
        'A rich chocolate cake with a gooey molten center.',
      image: 'https://via.placeholder.com/300?text=Chocolate+Lava+Cake',
      category: 'Desserts',
    },
    // Add more recipes as needed
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Vegan', 'Italian', 'Asian', 'Desserts'];

  const filteredRecipes =
    selectedCategory === 'All'
      ? recipes
      : recipes.filter((recipe) => recipe.category === selectedCategory);

  return (
    <div className={styles.container}>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>Tasty Recipes</h1>
          <p className={styles.subtitle}>
            Discover and share your favorite recipes from around the world!
          </p>
          <button className={styles.ctaButton}>Browse All Recipes</button>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <h2>Filter by Category</h2>
        <div className={styles.filters}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                selectedCategory === category ? styles.activeFilter : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Recipes Grid Section */}
      <section className={styles.recipesGrid}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              className={styles.recipeCard}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className={styles.recipeImage}
              />
              <h3 className={styles.recipeName}>{recipe.name}</h3>
              <p className={styles.recipeDescription}>{recipe.description}</p>
              <button className={styles.recipeButton}>View Recipe</button>
            </motion.div>
          ))
        ) : (
          <p className={styles.noRecipes}>No recipes found for this category.</p>
        )}
      </section>

      {/* Cooking Tips Section */}
      <section className={styles.tipsSection}>
        <h2 className={styles.tipsTitle}>Chef’s Cooking Tips</h2>
        <div className={styles.tipsGrid}>
          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>🔥</div>
            <h3 className={styles.tipHeading}>Perfect Searing</h3>
            <p>
              Always pat your meat dry before cooking for a crisp, caramelized
              crust.
            </p>
          </motion.div>

          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>⏲️</div>
            <h3 className={styles.tipHeading}>Timing is Key</h3>
            <p>
              Use a kitchen timer to avoid overcooking or undercooking your
              meals.
            </p>
          </motion.div>

          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>🍲</div>
            <h3 className={styles.tipHeading}>Layering Flavors</h3>
            <p>
              Sauté onions and garlic first to create a flavor base for soups and
              sauces.
            </p>
          </motion.div>

          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>🌿</div>
            <h3 className={styles.tipHeading}>Fresh Ingredients</h3>
            <p>
              Use fresh, seasonal ingredients to maximize taste and nutrition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className={styles.newsletterSection}>
        <h2>Stay Updated with Our Latest Recipes!</h2>
        <p>
          Subscribe to our newsletter for weekly cooking tips, new recipes, and
          more.
        </p>
        <form className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email..."
            required
            className={styles.newsletterInput}
          />
          <button type="submit" className={styles.newsletterButton}>
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default RecipesPage;
