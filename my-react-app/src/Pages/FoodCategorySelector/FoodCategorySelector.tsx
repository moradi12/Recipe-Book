import React, { useState } from "react";
import { FoodCategory } from "../../Models/FoodCategory";
import styles from "./FoodCategorySelector.module.css";

const FoodCategorySelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as FoodCategory);
  };

  return (
    <div className={styles.selectorWrapper}>
      <label htmlFor="foodCategory" className={styles.label}>
        Select Food Category:
      </label>
      <select id="foodCategory" className={styles.select} onChange={handleChange}>
        <option value="">Select...</option>
        {Object.values(FoodCategory).map((category) => (
          <option key={category} value={category}>
            {category.replace("_", " ")}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <p className={styles.selectedCategory}>Selected Category: {selectedCategory}</p>
      )}
    </div>
  );
};

export default FoodCategorySelector;
