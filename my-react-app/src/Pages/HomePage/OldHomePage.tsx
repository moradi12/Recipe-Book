// src/components/HomePage/HomePage.tsx
import { motion } from 'framer-motion';
import React from 'react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
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
          <h1 className={styles.title}>Welcome to Dessert Delights</h1>
          <p className={styles.subtitle}>
            Indulge in sweet treats, heavenly bakes, and mouthwatering desserts.
          </p>
          <button className={styles.ctaButton}>Explore Recipes</button>
        </motion.div>
        <div className={styles.animatedBackground}></div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why You'll Love Our Desserts</h2>
        <div className={styles.featuresGrid}>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>🍰</div>
            <h3 className={styles.featureTitle}>Handcrafted Treats</h3>
            <p className={styles.featureDescription}>
              Our desserts are lovingly made from scratch with premium ingredients.
            </p>
          </motion.div>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>🍭</div>
            <h3 className={styles.featureTitle}>Variety of Flavors</h3>
            <p className={styles.featureDescription}>
              From classic vanilla to exotic matcha, there's something for every sweet tooth.
            </p>
          </motion.div>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.icon}>🍪</div>
            <h3 className={styles.featureTitle}>Tested & Approved</h3>
            <p className={styles.featureDescription}>
              Every recipe is taste-tested to ensure the perfect balance of flavor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Dessert Lovers Say</h2>
        <div className={styles.carousel}>
          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className={styles.testimonialText}>
              "I've never tasted brownies this fudgy and delicious before!"
            </p>
            <h4 className={styles.testimonialAuthor}>- Sarah K., Chocoholic</h4>
          </motion.div>

          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className={styles.testimonialText}>
              "These cupcake recipes turned my birthday into a sweet celebration."
            </p>
            <h4 className={styles.testimonialAuthor}>- Jake R., Happy Customer</h4>
          </motion.div>

          <motion.div
            className={styles.testimonial}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className={styles.testimonialText}>
              "Highly recommend Dessert Delights for anyone with a sweet tooth."
            </p>
            <h4 className={styles.testimonialAuthor}>- Emily J., Dessert Enthusiast</h4>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Satisfy Your Sweet Cravings?</h2>
        <button className={styles.ctaButton}>Get Baking!</button>
      </section>

      {/* Baking Tips Section */}
      <section className={styles.tips}>
        <h2 className={styles.sectionTitle}>Top Baking Tips</h2>
        <div className={styles.tipsGrid}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={styles.tipCard}
          >
            <div className={styles.tipIcon}>🔥</div>
            <h3 className={styles.tipTitle}>Preheat Your Oven</h3>
            <p className={styles.tipDescription}>
              Always preheat for at least 15 minutes for even baking results.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={styles.tipCard}
          >
            <div className={styles.tipIcon}>⏲</div>
            <h3 className={styles.tipTitle}>Watch the Timer</h3>
            <p className={styles.tipDescription}>
              Set multiple timers for mixing, baking, and cooling to avoid mistakes.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={styles.tipCard}
          >
            <div className={styles.tipIcon}>🧈</div>
            <h3 className={styles.tipTitle}>Room-Temp Ingredients</h3>
            <p className={styles.tipDescription}>
              Butter and eggs at room temperature blend better into batter.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={styles.tipCard}
          >
            <div className={styles.tipIcon}>🔪</div>
            <h3 className={styles.tipTitle}>Use the Right Tools</h3>
            <p className={styles.tipDescription}>
              A quality whisk, spatula, and mixer can elevate your baking game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletter}>
        <h2 className={styles.sectionTitle}>Stay Updated on Sweet Treats</h2>
        <p className={styles.newsletterDescription}>
          Join our newsletter to get the latest recipes, tips, and dessert inspiration!
        </p>
        <form className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Enter your email..."
            className={styles.newsletterInput}
            required
          />
          <button type="submit" className={styles.subscribeButton}>
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
