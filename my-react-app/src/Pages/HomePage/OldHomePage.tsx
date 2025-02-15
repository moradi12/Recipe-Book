// src/components/HomePage/HomePage.tsx

import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './HomePage.module.css';

// Common motion settings
const hoverAnimation = { scale: 1.05 };
const hoverTransition = { duration: 0.3 };

// Data for features, testimonials, and new seasonal delights
const featuresData = [
  {
    icon: '🍰',
    title: 'Handcrafted Treats',
    description:
      'Our desserts are lovingly made from scratch with premium ingredients.',
  },
  {
    icon: '🍭',
    title: 'Variety of Flavors',
    description:
      'From classic vanilla to exotic matcha, there’s something for every sweet tooth.',
  },
  {
    icon: '🍪',
    title: 'Tested & Approved',
    description:
      'Every recipe is taste-tested to ensure the perfect balance of flavor.',
  },

  
];

const testimonialsData = [
  {
    text: `"I've never tasted brownies this fudgy and delicious before!"`,
    author: '- Sarah K., Chocoholic',
    initialX: -60,
  },
  {
    text: `"These cupcake recipes turned my birthday into a sweet celebration."`,
    author: '- Jake R., Happy Customer',
    initialX: 60,
  },
  
  {
    text: `"Highly recommend Dessert Delights for anyone with a sweet tooth."`,
    author: '- Emily J., Dessert Enthusiast',
    initialY: 60,
  },


  
];

// NEW SECTION: Seasonal Delights
const seasonalDelightsData = [
  {
    icon: '🍓',
    title: 'Strawberry Tart',
    description:
      'Celebrate spring with fresh strawberries on a buttery crust—light and delicious!',
  },
  {
    icon: '🌴',
    title: 'Tropical Parfait',
    description:
      'Escape to a tropical paradise with layers of creamy coconut, mango, and pineapple.',
  },
  {
    icon: '🍫',
    title: 'Double Chocolate Mousse',
    description:
      'Indulge in rich, velvety mousse that will satisfy the biggest chocoholics.',
  },
  {
    icon: '🍋',
    title: 'Zesty Lemon Bars',
    description:
      'Brighten your day with tangy lemon curd on a buttery shortbread base.',
  },
  // TWO NEW DELIGHTS
  {
    icon: '🍎',
    title: 'Apple Cinnamon Donuts',
    description:
      'Warm autumn flavors in every bite, sprinkled with sweet cinnamon sugar.',
  },
  {
    icon: '❄️',
    title: 'Peppermint Hot Cocoa Cake',
    description:
      'A winter wonder, layering rich chocolate cake with cool peppermint frosting.',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
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
          <button
            className={styles.ctaButton}
            onClick={() => navigate('/all/recipes')}
            aria-label="Explore dessert recipes"
          >
            Explore Recipes
          </button>
        </motion.div>
        <div className={styles.animatedBackground}></div>
      </header>

      <main>
        {/* Features Section */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why You'll Love Our Desserts</h2>
          <div className={styles.featuresGrid}>
            {featuresData.map((feature) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                whileHover={hoverAnimation}
                transition={hoverTransition}
              >
                <div className={styles.icon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonials}>
          <h2 className={styles.sectionTitle}>What Dessert Lovers Say</h2>
          <div className={styles.carousel}>
            {testimonialsData.map((testimonial, index) => {
              // Determine the initial animation property dynamically (x or y)
              const initial =
                testimonial.initialX !== undefined
                  ? { opacity: 0, x: testimonial.initialX }
                  : { opacity: 0, y: testimonial.initialY };
              return (
                <motion.div
                  key={index}
                  className={styles.testimonial}
                  initial={initial}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <p className={styles.testimonialText}>{testimonial.text}</p>
                  <h4 className={styles.testimonialAuthor}>
                    {testimonial.author}
                  </h4>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            Ready to Satisfy Your Sweet Cravings?
          </h2>
          <button
            className={styles.ctaButton}
            aria-label="Start baking delicious desserts now"
          >
            Get Baking!
          </button>
        </section>

        {/* NEW: Seasonal Delights Section */}
        <section className={styles.delights}>
          <h2 className={styles.sectionTitle}>Seasonal Delights</h2>
          <div className={styles.delightsGrid}>
            {seasonalDelightsData.map((item) => (
              <motion.div
                key={item.title}
                className={styles.delightCard}
                whileHover={hoverAnimation}
                transition={hoverTransition}
              >
                <div className={styles.delightIcon}>{item.icon}</div>
                <h3 className={styles.delightTitle}>{item.title}</h3>
                <p className={styles.delightDescription}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className={styles.newsletter}>
          <h2 className={styles.sectionTitle}>Stay Updated on Sweet Treats</h2>
          <p className={styles.newsletterDescription}>
            Join our newsletter to get the latest recipes, tips, and dessert
            inspiration!
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
      </main>
    </div>
  );
};

export default HomePage;
