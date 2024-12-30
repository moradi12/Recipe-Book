import React, { useEffect, useState } from 'react';
import RecipeService from '../../Service/RecipeService';

interface FoodCategory {
  name: string;
  description: string;
}

const FoodCategoryDropdown: React.FC = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await RecipeService.getFoodCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch food categories:', error);
      }
    };
    loadCategories();
  }, []);

  return (
    <select>
      {categories.map((category) => (
        <option key={category.name} value={category.name}>
          {category.description}
        </option>
      ))}
    </select>
  );
};

export default FoodCategoryDropdown;
