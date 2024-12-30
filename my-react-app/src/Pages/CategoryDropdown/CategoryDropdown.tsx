import React, { useEffect, useState } from "react";
import { Category } from "../../Models/Category";
import { fetchCategories } from "../../Utiles/recipesApi";
import './CategoryDropdown.css';

const CategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select a Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {selectedCategory && <p>Selected: {selectedCategory}</p>}
    </div>
  );
};

export default CategoryDropdown;
