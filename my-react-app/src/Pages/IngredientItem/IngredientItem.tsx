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
    // Generate unique IDs for accessibility
    const nameId = `ingredient-name-${index}`;
    const quantityId = `ingredient-quantity-${index}`;
    const unitId = `ingredient-unit-${index}`;

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(index, name as keyof IngredientRequest, value);
    };

    return (
        <fieldset className="ingredient-item">
            <legend>Ingredient {index + 1}</legend>
            <div className="input-group">
                <label htmlFor={nameId}>Name*</label>
                <input
                    type="text"
                    id={nameId}
                    name="name"
                    placeholder="e.g., Sugar"
                    value={ingredient.name}
                    onChange={handleFieldChange}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor={quantityId}>Quantity*</label>
                <input
                    type="number"
                    id={quantityId}
                    name="quantity"
                    placeholder="e.g., 2"
                    value={ingredient.quantity}
                    onChange={handleFieldChange}
                    min="0"
                    step="any"
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor={unitId}>Unit*</label>
                <input
                    type="text"
                    id={unitId}
                    name="unit"
                    placeholder="e.g., Cups"
                    value={ingredient.unit}
                    onChange={handleFieldChange}
                    required
                />
            </div>
            {canRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="remove-ingredient-button"
                    aria-label={`Remove Ingredient ${index + 1}`}
                >
                    Remove
                </button>
            )}
        </fieldset>
    );
};

export default IngredientItem;
