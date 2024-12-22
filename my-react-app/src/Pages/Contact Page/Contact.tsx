// src/components/Contact/Contact.tsx
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import styles from './Contact.module.css';

/**
 * Interface representing the structure of the contact form data.
 */
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Interface representing the structure of the API error response.
 */
interface ApiErrorResponse {
  message: string;
  // Add other fields if your API returns more information
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Handles changes to form input fields.
   * @param e - The change event from the input or textarea.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Validates the email format.
   * @param email - The email string to validate.
   * @returns True if the email is valid, otherwise false.
   */
  const validateEmail = (email: string): boolean => {
    // Simple email regex for validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  /**
   * Handles the form submission.
   * @param e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous error messages
    setErrorMessage('');

    // Basic form validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('All fields are required.');
      setStatus('error');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Replace with your backend API endpoint
      const response = await axios.post('/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // Optional: Set a timeout for the request
      });

      if (response.status === 200) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Handle unexpected status codes
        setErrorMessage('Something went wrong. Please try again later.');
        setStatus('error');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        if (axiosError.response) {
          // Server responded with a status other than 2xx
          setErrorMessage(axiosError.response.data.message || 'An error occurred while submitting the form.');
        } else if (axiosError.request) {
          // Request was made but no response received
          setErrorMessage('No response from the server. Please check your network connection.');
        } else {
          // Something happened in setting up the request
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      } else {
        // Non-Axios error
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setStatus('error');

      // Optional: Log the error for debugging purposes
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Contact Us</h2>
      <motion.form
        className={styles.contactForm}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        noValidate
      >
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            aria-required="true"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            aria-required="true"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            aria-required="true"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            required
            aria-required="true"
          ></textarea>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <p className={styles.success} role="status">
            Message sent successfully!
          </p>
        )}

        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </motion.form>
    </div>
  );
};

export default Contact;
