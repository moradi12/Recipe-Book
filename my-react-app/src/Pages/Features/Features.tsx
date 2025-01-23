// src/components/Features/Features.tsx

import { motion } from 'framer-motion';
import React from 'react';
import {
  FaAppleAlt,
  FaBacon,
  FaCarrot,
  FaCheese,
  FaCookieBite,
  FaDrumstickBite,
  FaEgg,
  FaFish,
  FaHamburger,
  FaIceCream,
  FaPepperHot,
  FaPizzaSlice
} from 'react-icons/fa';

import styles from './Features.module.css';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const featuresData: Feature[] = [
  {
    icon: <FaPizzaSlice />,
    title: 'Gourmet Pizzas',
    description:
      'Experience our hand-tossed dough and secret sauce, made fresh daily.',
    color: '#e67e22', // Orange
  },
  {
    icon: <FaHamburger />,
    title: 'Juicy Burgers',
    description:
      'Made with premium ground beef, layered with crisp veggies and gooey cheese.',
    color: '#e74c3c', // Red
  },
  {
    icon: <FaIceCream />,
    title: 'Decadent Desserts',
    description:
      'Treat yourself to creamy ice creams, rich brownies, and scrumptious pastries.',
    color: '#f1c40f', // Yellow
  },
  {
    icon: <FaFish />,
    title: 'Fresh Seafood',
    description:
      'Sourced responsibly to bring you the most flavorful fish and shellfish.',
    color: '#2980b9', // Blue
  },
  {
    icon: <FaAppleAlt />,
    title: 'Farm-Fresh Produce',
    description:
      'Locally sourced fruits and vegetables for maximum taste and nutrition.',
    color: '#27ae60', // Green
  },
  {
    icon: <FaCookieBite />,
    title: 'Handmade Snacks',
    description:
      'From crunchy cookies to savory chips, all crafted with love.',
    color: '#8e44ad', // Purple
  },
  // 6 New Features Below
  {
    icon: <FaBacon />,
    title: 'Sizzling Bacon',
    description:
      'Crispy, smoky bacon to take your breakfast or burger to the next level.',
    color: '#B03A2E',
  },
  {
    icon: <FaCheese />,
    title: 'Artisanal Cheeses',
    description:
      'A curated selection of local and imported cheeses for all your cravings.',
    color: '#F5CBA7',
  },
  {
    icon: <FaEgg />,
    title: 'Brunch Specials',
    description:
      'Egg-cellent dishes crafted to brighten your mornings.',
    color: '#D35400',
  },
  {
    icon: <FaPepperHot />,
    title: 'Spicy Delights',
    description:
      'Hot and fiery flavors for those who crave a real kick.',
    color: '#C0392B',
  },
  {
    icon: <FaCarrot />,
    title: 'Veggie Varieties',
    description:
      'A rainbow of produce and plant-based dishes that are anything but bland.',
    color: '#E67E22',
  },
  {
    icon: <FaDrumstickBite />,
    title: 'Crispy Chicken',
    description:
      'Juicy, golden fried chicken that hits the spot every time.',
    color: '#AF601A',
  },
];

const Features: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Savor the Flavors: Our Top Features</h2>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div
              className={styles.icon}
              style={{ color: feature.color }}
              aria-label={feature.title}
            >
              {feature.icon}
            </div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
