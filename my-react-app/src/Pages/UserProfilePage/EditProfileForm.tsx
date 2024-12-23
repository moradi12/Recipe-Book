// Components/EditProfileForm.tsx

import React, { useState } from 'react';
import { UserProfile } from '../../Models/UserProfile';

interface EditProfileFormProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onUpdate }) => {
  // Initialize form state with existing profile data
  const [username, setUsername] = useState<string>(profile.username);
  const [email, setEmail] = useState<string>(profile.email);
  const [bio, setBio] = useState<string>(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatarUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      setError('Username is required.');
      setSuccess(null);
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      setSuccess(null);
      return;
    }

    // Optional: Add more validation (e.g., email format) here

    // Create updated profile object
    const updatedProfile: UserProfile = {
      ...profile,
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
    };

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Invoke the onUpdate callback with the updated profile
      await onUpdate(updatedProfile);

      setSuccess('Profile updated successfully!');
    } catch (updateError: unknown) {
      if (updateError instanceof Error) {
        setError(updateError.message);
      } else {
        setError('An unknown error occurred while updating the profile.');
      }
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Edit Profile</h3>
      
      {error && <p style={styles.error}>Error: {error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      <div style={styles.formGroup}>
        <label htmlFor="username" style={styles.label}>Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="email" style={styles.label}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="bio" style={styles.label}>Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="avatarUrl" style={styles.label}>Avatar URL:</label>
        <input
          type="text"
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          style={styles.input}
        />
      </div>

      <button type="submit" style={styles.button} disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

// Inline styles for simplicity; consider using CSS modules or styled-components for larger projects
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '500px',
    marginTop: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
    minHeight: '100px',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  success: {
    color: 'green',
    marginBottom: '1rem',
  },
};

export default EditProfileForm;
