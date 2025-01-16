import React from "react";

interface ErrorMessagesProps {
  errors: Record<string, string>;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  // If there are no errors, return null
  if (Object.keys(errors).length === 0) return null;

  // Optionally hide field-level errors here if you only want to show them inline
  // For now, we show everything
  return (
    <div className="error-messages">
      <ul>
        {Object.values(errors).map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessages;
