// src/components/Dashboard/Dashboard.tsx
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { notify } from '../../Utiles/notif';
import { AppError } from '../../errors/AppError';
import styles from './Dashboard.module.css';

interface UserData {
  id: string;
  username: string;
  email: string;
  // Add other user-specific fields as needed
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.status === 200) {
          setUserData(response.data);
          notify.success('User data loaded successfully!');
        } else {
          notify.error('Failed to fetch user data.');
        }
      } catch (error) {
        const errorMessage = error instanceof AppError 
          ? error.getUserMessage() 
          : 'Failed to fetch user data';
        notify.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getToken = (): string | null => {
    return localStorage.getItem('jwtToken');
  };

  if (loading) {
    return <div className={styles.loading}>Loading your dashboard...</div>;
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.heading}>Welcome, {userData?.username}!</h2>
      <div className={styles.profileSection}>
        <h3>Your Profile</h3>
        <p><strong>Username:</strong> {userData?.username}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
      </div>

      <div className={styles.activitiesSection}>
        <h3>Recent Activities</h3>
        <ul>
          <li>Logged in from IP 192.168.1.1</li>
          <li>Updated profile information</li>
          <li>Uploaded a new document</li>
        </ul>
      </div>

      <div className={styles.actionsSection}>
        <h3>Actions</h3>
        <button className={styles.actionButton}>Update Profile</button>
        <button className={styles.actionButton}>Change Password</button>
      </div>
    </motion.div>
  );
};

export default Dashboard;
