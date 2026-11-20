import React, { useCallback, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const INPUT_BASE_CLASS =
  'w-full min-h-[40px] px-3 py-2 text-[14px] text-[#1F2937] bg-[#FFFFFF] border border-[#D6E6F2] rounded-[8px] placeholder:text-[#5B6B7C] focus:outline-none focus:border-[#1C7AC0] focus:ring-2 focus:ring-[#1C7AC0]/20 transition-colors';

function InputFieldComponent({
  id,
  label,
  error,
  required,
  helperText,
  type = 'text',
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-[#1F2937]">
        {label}
        {required && (
          <span className="text-[#D9534F] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={resolvedType}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-help` : undefined
          }
          className={`${INPUT_BASE_CLASS} ${isPassword ? 'pr-11' : ''} ${
            error ? 'border-[#D9534F]' : ''
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute right-2 inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-[#5B6B7C] hover:text-[#1C7AC0] hover:bg-[#E6F2FB] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[13px] text-[#D9534F]">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-help`} className="text-[13px] text-[#5B6B7C]">
          {helperText}
        </p>
      )}
    </div>
  );
}

export const InputField = React.memo(InputFieldComponent);
InputField.displayName = 'InputField';

function SelectFieldComponent({
  id,
  label,
  error,
  required,
  helperText,
  options,
  className = '',
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-[#1F2937]">
        {label}
        {required && (
          <span className="text-[#D9534F] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        className={`${INPUT_BASE_CLASS} ${error ? 'border-[#D9534F]' : ''} ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[13px] text-[#D9534F]">{error}</p>}
      {!error && helperText && (
        <p className="text-[13px] text-[#5B6B7C]">{helperText}</p>
      )}
    </div>
  );
}

export const SelectField = React.memo(SelectFieldComponent);
SelectField.displayName = 'SelectField';