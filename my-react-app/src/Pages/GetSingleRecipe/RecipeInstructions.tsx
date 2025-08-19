import React from 'react';

interface RecipeInstructionsProps {
  instructions: string;
}

const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({ instructions }) => {
  
  const hasInstructions = instructions && instructions.trim().length > 0;
  
  return (
    <div className="recipe-section">
      <h2 className="section-title">Preparation Steps</h2>
      <div className="instructions-content">
        {hasInstructions ? (
          <div style={{ whiteSpace: 'pre-line' }}>
            {instructions.trim()}
          </div>
        ) : (
          <div className="no-data">
            <p>No preparation steps available for this recipe.</p>
            <p><small>This recipe may not have been fully completed yet.</small></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeInstructions;