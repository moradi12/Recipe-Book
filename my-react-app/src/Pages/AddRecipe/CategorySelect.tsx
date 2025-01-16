import React from "react";
import { Category } from "../../Models/Category";

interface CategorySelectProps {
  categories: Category[];
  selectedCategoryId: number | "";
  onChange: (value: string) => void;
  error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategoryId,
  onChange,
  error,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="category">Category*</label>
      <select
        id="category"
        value={selectedCategoryId}
        onChange={(e) => onChange(e.target.value)}
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
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default CategorySelect;
