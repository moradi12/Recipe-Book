// src/Components/AddShoppingListItemForm.tsx

import React, { useState } from 'react';
import { NewShoppingListItem } from '../../Models/NewShoppingListItem';
import './AddShoppingListItemForm.css';
interface AddShoppingListItemFormProps {
  onAdd: (item: NewShoppingListItem) => void;
}

const AddShoppingListItemForm: React.FC<AddShoppingListItemFormProps> = ({ onAdd }) => {
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quantity.trim()) {
      setError('Both name and quantity are required.');
      return;
    }
    const newItem: NewShoppingListItem = {
      name: name.trim(),
      quantity: quantity.trim(),
    };
    onAdd(newItem);
    setName('');
    setQuantity('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4>Add New Item</h4>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.formGroup}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Add Item</button>
      </div>
    </form>
  );
};

// Inline styles for simplicity
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    marginTop: '1rem',
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  formGroup: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
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
    backgroundColor: '#28A745',
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

export default AddShoppingListItemForm;
