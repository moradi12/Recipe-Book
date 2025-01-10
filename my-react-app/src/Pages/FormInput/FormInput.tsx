import React from "react";

type InputType = "text" | "number" | "textarea" | "file";

interface FormInputProps {
  label: string;
  type: InputType;
  name: string;
  value?: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  ariaLabel?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  multiline,
  ariaLabel,
}) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={type === "file" ? undefined : value} // Avoid setting value for file inputs
          onChange={onChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
      )}
    </div>
  );
};

export default FormInput;
