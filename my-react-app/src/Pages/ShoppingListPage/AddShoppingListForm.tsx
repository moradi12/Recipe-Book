// src/Components/AddShoppingListForm.tsx
import React, { useState } from 'react';
import './AddShoppingListForm.css';

interface AddShoppingListFormProps {
  onAdd: (name: string) => void;
}

const AddShoppingListForm: React.FC<AddShoppingListFormProps> = ({ onAdd }) => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Shopping list name is required.');
      return;
    }
    onAdd(name.trim());
    setName('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Add New Shopping List</h3>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.formGroup}>
        <input
          type="text"
          placeholder="Enter shopping list name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Add List</button>
      </div>
    </form>
  );
};

// Inline styles for simplicity
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    marginBottom: '1.5rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fefefe',
  },
  formGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flexGrow: 1,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '0.5rem',
  },
};

export default AddShoppingListForm;
