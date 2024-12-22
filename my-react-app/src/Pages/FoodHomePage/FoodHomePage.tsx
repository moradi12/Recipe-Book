// src/components/FoodHomePage/FoodHomePage.tsx
import { motion } from 'framer-motion';
import React from 'react';
import styles from './FoodHomePage.module.css';

const FoodHomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={styles.title}>Welcome to Foodie Haven</h1>
          <p className={styles.subtitle}>
            Discover, cook, and enjoy delicious recipes from around the world.
          </p>
          <button className={styles.ctaButton}>Browse Recipes</button>
        </motion.div>
        <div className={styles.animatedBackground}></div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>Our Platform Highlights</h2>
        <div className={styles.featuresGrid}>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>⚡</div>
            <h3>Quick & Easy</h3>
            <p>Simple recipes that don’t require hours in the kitchen.</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>\uD83E\uDD51</div>
            <h3>Healthy Options</h3>
            <p>Explore nutritious recipes packed with vitamins and flavors.</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>\uD83C\uDF57</div>
            <h3>Global Cuisines</h3>
            <p>Indulge in cuisines from different cultures and traditions.</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>\uD83D\uDCDA</div>
            <h3>Expert Tips</h3>
            <p>Learn cooking secrets and pro tips from master chefs.</p>
          </motion.div>
        </div>
      </section>

      {/* Recipe Highlights Section */}
      <section className={styles.highlights}>
        <h2>Trending Recipes</h2>
        <div className={styles.recipesGrid}>
          <motion.div
            className={styles.recipeCard}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src="https://via.placeholder.com/300?text=Mexican+Tacos"
              alt="Mexican Tacos"
              className={styles.recipeImage}
            />
            <h3>Mexican Tacos</h3>
            <p>Spicy, flavorful, and super easy to make in 15 minutes.</p>
          </motion.div>

          <motion.div
            className={styles.recipeCard}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src="https://via.placeholder.com/300?text=Pasta+Carbonara"
              alt="Pasta Carbonara"
              className={styles.recipeImage}
            />
            <h3>Pasta Carbonara</h3>
            <p>Rich and creamy Italian classic with bacon and cheese.</p>
          </motion.div>

          <motion.div
            className={styles.recipeCard}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src="https://via.placeholder.com/300?text=Avocado+Salad"
              alt="Avocado Salad"
              className={styles.recipeImage}
            />
            <h3>Avocado Salad</h3>
            <p>Fresh and healthy salad loaded with avocado goodness.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Users Say</h2>
        <div className={styles.carousel}>
          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>
              "Foodie Haven helped me find easy and healthy meals for my busy schedule!"
            </p>
            <h4>- Sarah K.</h4>
          </motion.div>

          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>
              "I'm in love with their authentic international recipes—always a hit at dinner parties."
            </p>
            <h4>- David L.</h4>
          </motion.div>

          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>
              "The expert tips section has made me a better cook, even though I'm a beginner!"
            </p>
            <h4>- Maria R.</h4>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.cta}>
        <h2>Ready to Spice Up Your Cooking?</h2>
        <button className={styles.ctaButton}>Join Us Today</button>
      </section>
    </div>
  );
};

export default FoodHomePage;
