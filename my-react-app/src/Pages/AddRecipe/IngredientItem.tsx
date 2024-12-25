// src/components/IngredientItem.tsx

import React from 'react';
import { IngredientRequest } from '../../Models/RecipeCreateRequest';
import { UNIT_OPTIONS } from '../../Models/constants';

interface IngredientItemProps {
    index: number;
    ingredient: IngredientRequest;
    onChange: (index: number, field: keyof IngredientRequest, value: string) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ index, ingredient, onChange, onRemove, canRemove }) => {
    return (
        <div className="ingredient-item">
            <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => onChange(index, 'quantity', e.target.value)}
                required
            />
            <select
                value={ingredient.unit}
                onChange={(e) => onChange(index, 'unit', e.target.value)}
                required
            >
                {UNIT_OPTIONS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                        {unit.label}
                    </option>
                ))}
            </select>
            {canRemove && (
                <button type="button" onClick={() => onRemove(index)}>
                    Remove
                </button>
            )}
        </div>
    );
};

export default IngredientItem;
