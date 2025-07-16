import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = "",
  id,
  ...props
}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        id={checkboxId}
        className={`w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 mt-0.5 ${className}`}
        {...props}
      />
      <div className="flex-1">
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};
