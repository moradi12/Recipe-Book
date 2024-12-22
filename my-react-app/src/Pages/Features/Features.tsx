// src/components/Features/Features.tsx
import { motion } from 'framer-motion';
import React from 'react';
import styles from './Features.module.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const featuresData: Feature[] = [
  {
    icon: '⚡',
    title: 'High Performance',
    description: 'Experience blazing fast speeds with our optimized solutions.',
  },
  {
    icon: '🔒',
    title: 'Top-Notch Security',
    description: 'Your data is protected with industry-leading security measures.',
  },
  {
    icon: '🤖',
    title: 'AI Integration',
    description: 'Leverage artificial intelligence to enhance your workflows.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Access our services seamlessly across all your devices.',
  },
  {
    icon: '🌐',
    title: 'Global Reach',
    description: 'Expand your business globally with our scalable solutions.',
  },
  {
    icon: '💼',
    title: 'Professional Support',
    description: 'Get 24/7 support from our team of experts.',
  },
];

const Features: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Our Features</h2>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
