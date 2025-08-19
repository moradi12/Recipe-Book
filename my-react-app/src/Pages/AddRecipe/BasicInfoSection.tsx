import React from 'react';
import { Category } from '../../Models/Category';

interface BasicInfoSectionProps {
  form: {
    title: string;
    description: string;
  };
  errors: Record<string, string>;
  categories: Category[];
  selectedCategoryId: number | "";
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  errors,
  categories,
  selectedCategoryId,
  onInputChange,
  onCategoryChange
}) => {
  return (
    <div className="form-section">
      <h3>Basic Information</h3>
      
      <div className="form-group">
        <label htmlFor="title">Recipe Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={onInputChange}
          required
          placeholder="Enter recipe title"
          className="add-recipe__input"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description*</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onInputChange}
          required
          placeholder="Describe your recipe"
          className="add-recipe__textarea"
          rows={3}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category*</label>
        <select
          id="category"
          value={selectedCategoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          required
          className="add-recipe__select"
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {selectedCategoryId === "" && <span className="error-text">Category is required</span>}
      </div>
    </div>
  );
};

export default BasicInfoSection;