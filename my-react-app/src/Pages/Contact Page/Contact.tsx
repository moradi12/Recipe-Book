import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './Contact.module.css';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  phone: '',
};

/* ---------------------- Reusable Form Field Component ---------------------- */
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          disabled={disabled}
        ></textarea>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
};

/* -------------------------- Contact Form Component ------------------------- */
interface ContactFormProps {
  formData: ContactFormData;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  status,
  errorMessage,
  handleChange,
  handleSubmit,
  resetForm,
}) => {
  return (
    <motion.form
      className={styles.contactForm}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      noValidate
    >
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        placeholder="Your Name"
        onChange={handleChange}
        required
        disabled={status === 'loading'}
      />

      <FormField
        label="Email"
        name="email"
        value={formData.email}
        placeholder="your.email@example.com"
        onChange={handleChange}
        type="email"
        required
        disabled={status === 'loading'}
      />

      <FormField
        label="Phone (optional)"
        name="phone"
        value={formData.phone || ''}
        placeholder="Your Phone Number"
        onChange={handleChange}
        type="tel"
        disabled={status === 'loading'}
      />

      <FormField
        label="Subject"
        name="subject"
        value={formData.subject}
        placeholder="Subject"
        onChange={handleChange}
        required
        disabled={status === 'loading'}
      />

      <FormField
        label="Message"
        name="message"
        value={formData.message}
        placeholder="Your message..."
        onChange={handleChange}
        type="textarea"
        required
        disabled={status === 'loading'}
      />

      {status === 'error' && (
        <motion.p
          className={styles.error}
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errorMessage}
        </motion.p>
      )}

      {status === 'success' && (
        <motion.p
          className={styles.success}
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Message sent successfully!
        </motion.p>
      )}

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        <button type="button" className={styles.resetButton} onClick={resetForm} disabled={status === 'loading'}>
          Reset
        </button>
      </div>
    </motion.form>
  );
};

/* -------------------------- Social Icons Component ------------------------- */
const SocialIcons: React.FC = () => (
  <div className={styles.socialMedia}>
    <a
      href="https://www.linkedin.com/in/tamir-moradi-1a62b0260/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
    >
      <svg className={styles.icon} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>LinkedIn</title>
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.851-3.039-1.851 0-2.135 1.445-2.135 2.939v5.669H9.355V9.5h3.414v1.496h.049c.476-.9 1.637-1.85 3.372-1.85 3.605 0 4.271 2.373 4.271 5.455v6.851zM5.337 8.008a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM6.987 20.452H3.688V9.5h3.299v10.952zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.549C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.271V1.723C24 .771 23.208 0 22.225 0z"
        />
      </svg>
    </a>

    <a
      href="https://github.com/moradi12"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
    >
      <svg className={styles.icon} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>GitHub</title>
        <path
          fill="currentColor"
          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        />
      </svg>
    </a>

    <a
      href="https://www.facebook.com/tamir.moradi/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
    >
      <svg className={styles.icon} role="img" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
        <title>Facebook</title>
        <path
          fill="currentColor"
          d="M279.14 288l14.22-92.66h-88.91V127.17c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S273.38 0 234.33 0C141.09 0 89.37 54.42 89.37 154.67v68.67H0v92.66h89.37V512h107.8V288z"
        />
      </svg>
    </a>
  </div>
);

/* ------------------------- Contact Info Component -------------------------- */
const ContactInfo: React.FC = () => {
  return (
    <div className={styles.contactInfo}>
      <h3>Other Ways to Contact</h3>
      <p>
        <strong>Address:</strong> Tel Aviv
      </p>
      <p>
        <strong>Phone:</strong> +1 234 567 890
      </p>
      <p>
        <strong>Email:</strong> info@example.com
      </p>
      <SocialIcons />
    </div>
  );
};

/* ------------------------- Main Contact Component -------------------------- */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
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
      const formElement = e.currentTarget;
      const data = new FormData(formElement);
      data.append('access_key', '55782fea-0503-4e2e-9261-dcd7e97639ad');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setStatus('success');
        resetForm();
        formElement.reset();
      } else {
        const msg = result.message || 'Something went wrong. Please try again later.';
        setErrorMessage(msg);
        setStatus('error');
        Swal.fire({ title: 'Error', text: msg, icon: 'error' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setStatus('error');
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Contact Us</h2>
      <div className={styles.content}>
        <ContactForm
          formData={formData}
          status={status}
          errorMessage={errorMessage}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
        />
        <ContactInfo />
      </div>
    </div>
  );
};

export default Contact;
