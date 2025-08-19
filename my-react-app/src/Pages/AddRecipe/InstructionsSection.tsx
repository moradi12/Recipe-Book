import React from 'react';

interface InstructionsSectionProps {
  instructions: string;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  error,
  onInputChange
}) => {
  return (
    <div className="form-section">
      <h3>Instructions</h3>
      <div className="form-group">
        <label htmlFor="instructions">Cooking Instructions*</label>
        <textarea
          id="instructions"
          name="instructions"
          value={instructions}
          onChange={onInputChange}
          required
          placeholder="Step-by-step cooking instructions"
          className="add-recipe__textarea"
          rows={6}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
    </div>
  );
};

export default InstructionsSection;