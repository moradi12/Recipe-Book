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
    <div className="form-section fade-in">
      <h3>
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Cooking Instructions
      </h3>
      <div className="form-group">
        <label htmlFor="instructions">Step-by-Step Instructions*</label>
        <div className="input-wrapper">
          <textarea
            id="instructions"
            name="instructions"
            value={instructions}
            onChange={onInputChange}
            required
            placeholder="1. Preheat your oven to 350°F (175°C)&#10;2. In a large bowl, mix all dry ingredients&#10;3. Add wet ingredients and stir until combined&#10;4. Bake for 25-30 minutes until golden brown&#10;&#10;Write each step clearly and in order for the best cooking experience!"
            className="add-recipe__textarea"
            rows={8}
          />
        </div>
        {error && <span className="error-text">{error}</span>}
        <div className="instruction-helper">
          <div className="helper-item">
            <svg className="helper-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Number each step for clear, easy-to-follow instructions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsSection;