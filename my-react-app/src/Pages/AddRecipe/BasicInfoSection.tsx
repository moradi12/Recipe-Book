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
    <div className="form-section fade-in">
      <h3>
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Basic Information
      </h3>
      
      <div className="form-group">
        <label htmlFor="title">Recipe Title*</label>
        <div className="input-wrapper">
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={onInputChange}
            required
            placeholder="What's the name of your delicious creation?"
            className="add-recipe__input"
          />
        </div>
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description*</label>
        <div className="input-wrapper">
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onInputChange}
            required
            placeholder="Tell us what makes this recipe special. What inspired you to create it?"
            className="add-recipe__textarea"
            rows={4}
          />
        </div>
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category*</label>
        <div className="input-wrapper">
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            required
            className="add-recipe__select"
          >
            <option value="" disabled>
              Choose the perfect category for your recipe
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {selectedCategoryId === "" && <span className="error-text">Please select a category to help others find your recipe</span>}
      </div>
    </div>
  );
};

export default BasicInfoSection;