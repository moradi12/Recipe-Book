import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styles from './DessertPage.module.css';

interface Dessert {
  id: number;
  name: string;
  description: string;
  image: string;
}

const DessertPage: React.FC = () => {
  const [desserts] = useState<Dessert[]>([
    {
      id: 1,
      name: 'Tiramisu',
      description:
        'An Italian dessert made with coffee-soaked ladyfingers layered with mascarpone cheese.',
      image: 'https://via.placeholder.com/300?text=Tiramisu',
    },
    {
      id: 2,
      name: 'Chocolate Lava Cake',
      description:
        'A rich chocolate cake with a gooey molten center.',
      image: 'https://via.placeholder.com/300?text=Chocolate+Lava+Cake',
    },
    {
      id: 3,
      name: 'Cheesecake',
      description:
        'Creamy cheesecake with a buttery graham cracker crust topped with fresh berries.',
      image: 'https://via.placeholder.com/300?text=Cheesecake',
    },
    {
      id: 4,
      name: 'Macarons',
      description:
        'Delicate French macarons in assorted flavors with a crisp shell and soft center.',
      image: 'https://via.placeholder.com/300?text=Macarons',
    },
  ]);

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
          <h1 className={styles.title}>Decadent Desserts</h1>
          <p className={styles.subtitle}>
            Indulge in our handpicked selection of sweet treats!
          </p>
          <button className={styles.ctaButton}>Explore Desserts</button>
        </motion.div>
      </section>

      {/* Desserts Grid Section */}
      <section className={styles.dessertsGrid}>
        {desserts.map((dessert) => (
          <motion.div
            key={dessert.id}
            className={styles.dessertCard}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={dessert.image}
              alt={dessert.name}
              className={styles.dessertImage}
            />
            <h3 className={styles.dessertName}>{dessert.name}</h3>
            <p className={styles.dessertDescription}>{dessert.description}</p>
            <button className={styles.dessertButton}>View Recipe</button>
          </motion.div>
        ))}
      </section>

      {/* Dessert Tips Section */}
      <section className={styles.tipsSection}>
        <h2 className={styles.tipsTitle}>Sweet Tips for Perfect Desserts</h2>
        <div className={styles.tipsGrid}>
          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>🍫</div>
            <h3 className={styles.tipHeading}>Quality Ingredients</h3>
            <p>
              Always use high-quality chocolate and fresh dairy products for the best flavor.
            </p>
          </motion.div>

          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>❄️</div>
            <h3 className={styles.tipHeading}>Proper Chilling</h3>
            <p>
              Let desserts like cheesecake and mousse set properly in the refrigerator.
            </p>
          </motion.div>

          <motion.div
            className={styles.tipCard}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.tipIcon}>🎂</div>
            <h3 className={styles.tipHeading}>Balance the Sweetness</h3>
            <p>
              Adjust sugar levels to highlight flavors without overpowering them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className={styles.newsletterSection}>
        <h2>Stay Updated with More Sweet Recipes!</h2>
        <p>
          Subscribe to our newsletter for the latest dessert recipes and insider tips.
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

export default DessertPage;
