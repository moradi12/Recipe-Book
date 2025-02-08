import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import ChickenImage from "../../assets/Pics/Chicken.jpg";
import JuicyBurgerImage from "../../assets/Pics/JuicyBurger.jpg";
import TacosImage from "../../assets/Pics/Mexican+Tacos.jpg";
import PancakesImage from "../../assets/Pics/Pancakes.jpg";
import SteakImage from "../../assets/Pics/steak.jpg";
import SushiImage from "../../assets/Pics/Sushi.jpg";
import TunaImage from "../../assets/Pics/Tuna.jpg";
import WafflesImage from "../../assets/Pics/Waffles.jpg";
import styles from "./FoodHomePage.module.css";

const FoodHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBrowseRecipes = () => {
    navigate("/all/recipes");
  };

  const handleSubscribe = () => {
    // Add subscription functionality here if needed
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

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>💰</div>
            <h3>Budget-Friendly</h3>
            <p>
              Enjoy meals that are not only delicious but also kind to your wallet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recipe Highlights Section */}
      <section className={styles.highlights}>
        <h2>Trending Recipes</h2>
        <div className={styles.recipesGrid}>
        

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={PancakesImage}
              alt="Pancakes"
              className={styles.recipeImage}
            />
            <h3>Pancakes</h3>
            <p>Fluffy pancakes perfect for a weekend breakfast.</p>
          </motion.div>

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={WafflesImage}
              alt="Waffles"
              className={styles.recipeImage}
            />
            <h3>Waffles</h3>
            <p>Crispy and golden waffles topped with your favorite syrup.</p>
          </motion.div>

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={TacosImage}
              alt="Mexican Tacos"
              className={styles.recipeImage}
            />
            <h3>Mexican Tacos</h3>
            <p>Spicy, flavorful, and super easy to make in 15 minutes.</p>
          </motion.div>

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
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

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={JuicyBurgerImage}
              alt="Juicy Burger"
              className={styles.recipeImage}
            />
            <h3>Juicy Burger</h3>
            <p>The Ultimate Juicy Cheese Burger.</p>
          </motion.div>

   

          {/* Additional Recipe Cards */}

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={TunaImage}
              alt="Tuna Dish"
              className={styles.recipeImage}
            />
            <h3>Tuna</h3>
            <p>Fresh and delicious tuna served in a light salad.</p>
          </motion.div>

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={SushiImage}
              alt="Sushi Rolls"
              className={styles.recipeImage}
            />
            <h3>Sushi</h3>
            <p>Delicate sushi rolls with fresh fish and perfectly seasoned rice.</p>
          </motion.div>

          <motion.div className={styles.recipeCard} whileHover={{ scale: 1.03 }}>
            <img
              src={ChickenImage}
              alt="Grilled Chicken"
              className={styles.recipeImage}
            />
            <h3>Chicken</h3>
            <p>Juicy grilled chicken seasoned to perfection.</p>
          </motion.div>
        </div>
      </section>

      {/* Explore Recipes Section */}
      <section className={styles.exploreRecipes}>
        <button className={styles.exploreButton} onClick={handleBrowseRecipes}>
          Explore All Recipes
        </button>
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
