// src/components/Features/Features.tsx
import { motion } from 'framer-motion';
import React from 'react';
import {
  FaCalendarAlt,
  FaClipboardList,
  FaHeart,
  FaLeaf,
  FaLightbulb,
  FaMobileAlt,
  FaShoppingCart,
  FaStar,
  FaUtensils
} from 'react-icons/fa';
import styles from './Features.module.css';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string; // Added color property
}

const featuresData: Feature[] = [
  {
    icon: <FaUtensils />,
    title: 'Vast Recipe Collection',
    description: 'Explore thousands of recipes from various cuisines and dietary preferences.',
    color: '#e67e22', // Orange
  },
  {
    icon: <FaClipboardList />,
    title: 'Step-by-Step Instructions',
    description: 'Follow easy-to-understand steps to create delicious meals every time.',
    color: '#2ecc71', // Green
  },
  {
    icon: <FaLeaf />,
    title: 'Nutritional Information',
    description: 'Get detailed nutritional insights to maintain a balanced diet.',
    color: '#27ae60', // Dark Green
  },
  {
    icon: <FaStar />,
    title: 'User Ratings & Reviews',
    description: 'Read reviews and ratings from other users to choose the best recipes.',
    color: '#f1c40f', // Yellow
  },
  {
    icon: <FaCalendarAlt />,
    title: 'Meal Planning',
    description: 'Plan your meals ahead of time with our intuitive meal planner.',
    color: '#2980b9', // Blue
  },
  {
    icon: <FaShoppingCart />,
    title: 'Grocery List Integration',
    description: 'Automatically generate grocery lists based on your selected recipes.',
    color: '#8e44ad', // Purple
  },
  {
    icon: <FaLightbulb />,
    title: 'Chef Tips & Tricks',
    description: 'Learn from expert chefs with exclusive tips and cooking techniques.',
    color: '#f39c12', // Dark Yellow
  },
  {
    icon: <FaMobileAlt />,
    title: 'Mobile Friendly',
    description: 'Access our services seamlessly across all your devices.',
    color: '#34495e', // Dark Blue
  },
  {
    icon: <FaHeart />,
    title: 'Community Support',
    description: 'Join a vibrant community of food enthusiasts and share your creations.',
    color: '#e74c3c', // Red
  },
];

const Features: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Why Choose Our Recipe App</h2>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div 
              className={styles.icon} 
              style={{ color: feature.color }}
              aria-label={feature.title} // Improved accessibility
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
