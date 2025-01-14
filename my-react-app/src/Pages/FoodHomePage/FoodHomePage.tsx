import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import AvocadoSaladImage from "../../assets/Pics/AvocadoSaladImage.jpg";
import ChickenAvocadoImage from "../../assets/Pics/ChickenAvocado.jpg";
import TacosImage from "../../assets/Pics/Mexican+Tacos.jpg";
import SteakImage from "../../assets/Pics/steak.jpg";
import styles from "./FoodHomePage.module.css";

const FoodHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBrowseRecipes = () => {
    navigate("/all/recipes");
  };

  const handleSubscribe = () => {
    // You can add subscription functionality here
    alert("Thank you for subscribing!");
  };

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
            Discover, cook, and enjoy delicious recipes with a pink twist!
          </p>
          <button className={styles.ctaButton} onClick={handleBrowseRecipes}>
            Browse Recipes
          </button>
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
            <div className={styles.icon}>🥑</div>
            <h3>Healthy Options</h3>
            <p>Explore nutritious recipes packed with vitamins and flavors.</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>🍲</div>
            <h3>Global Cuisines</h3>
            <p>Indulge in cuisines from different cultures and traditions.</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>📚</div>
            <h3>Expert Tips</h3>
            <p>Learn cooking secrets and pro tips from master chefs.</p>
          </motion.div>

          {/* Additional Platform Highlights */}
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>💰</div>
            <h3>Budget-Friendly</h3>
            <p>
              Enjoy meals that are not only delicious but also kind to your
              wallet.
            </p>
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
              src={TacosImage}
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
              src={SteakImage}
              alt="Beef Steak"
              className={styles.recipeImage}
            />
            <h3>Beef Steak</h3>
            <p>
              Perfectly grilled steak with savory flavors and a juicy texture.
            </p>
          </motion.div>

          <motion.div
            className={styles.recipeCard}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={AvocadoSaladImage}
              alt="Avocado Salad"
              className={styles.recipeImage}
            />
            <h3>Avocado Salad</h3>
            <p>Fresh and healthy salad loaded with avocado goodness.</p>
          </motion.div>

          <motion.div
            className={styles.recipeCard}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={ChickenAvocadoImage}
              alt="Chicken and Avocado"
              className={styles.recipeImage}
            />
            <h3>Chicken and Avocado</h3>
            <p>Fresh and healthy Chicken Salad with Avocado.</p>
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
              "Foodie Haven helped me find easy and healthy meals for my busy
              schedule!"
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
              "I'm in love with their authentic international recipes—always a
              hit at dinner parties."
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
              "The expert tips section has made me a better cook, even though
              I'm a beginner!"
            </p>
            <h4>- Maria R.</h4>
          </motion.div>
        </div>
      </section>

      {/* Featured Chef Section */}
      

      {/* Newsletter Subscription Section */}
      <section className={styles.subscribe}>
        <h2>Join Our Newsletter</h2>
        <p>
          Get the latest recipes, tips, and more delivered right to your inbox!
        </p>
        <div className={styles.subscriptionForm}>
          <input
            type="email"
            placeholder="Your email address"
            className={styles.emailInput}
          />
          <button className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default FoodHomePage;
