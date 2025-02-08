import React from "react";

interface ErrorMessagesProps {
  errors: Record<string, string>;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors }) => {
  if (Object.keys(errors).length === 0) return null;
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
