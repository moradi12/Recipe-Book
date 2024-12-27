// src/components/IngredientItem.tsx

import React from 'react';
import { IngredientRequest } from '../../Models/RecipeCreateRequest';
import './IngredientItem.css';

interface IngredientItemProps {
    index: number;
    ingredient: IngredientRequest;
    onChange: (index: number, field: keyof IngredientRequest, value: string) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ index, ingredient, onChange, onRemove, canRemove }) => {
    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        onChange(index, id as keyof IngredientRequest, value);
    };

    return (
        <div className="ingredient-item">
            <input
                type="text"
                id="name"
                placeholder="Name"
                value={ingredient.name}
                onChange={handleFieldChange}
                required
            />
            <input
                type="text"
                id="quantity"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={handleFieldChange}
                required
            />
            <input
                type="text"
                id="unit"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={handleFieldChange}
                required
            />
            {canRemove && (
                <button type="button" onClick={() => onRemove(index)} className="remove-ingredient-button">
                    Remove
                </button>
            )}
        </div>
    );
};

export default IngredientItem;
