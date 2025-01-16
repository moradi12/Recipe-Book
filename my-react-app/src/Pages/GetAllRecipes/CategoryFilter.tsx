// src/Pages/GetAllRecipes/CategoryFilter.tsx

import React from "react";
import { Category } from "../../Models/Category";

interface CategoryFilterProps {
  categories: Category[];
  filterCategory: string;
  setFilterCategory: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  filterCategory,
  setFilterCategory,
  disabled = false,
}) => {
  return (
    <div className="filter-container">
      <label htmlFor="category-filter">Filter by Category:</label>
      <select
        id="category-filter"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        disabled={disabled}
      >
        <option value="">All Categories</option>
        {categories.map((cat: Category) => (
          <option key={cat.id} value={String(cat.id)}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
