import React, { ReactNode } from 'react';

// Form section with title and optional description
export function FormSection({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description?: string; 
  children: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-100">{title}</h2>
      {description && <p className="text-gray-400 mb-4 text-sm">{description}</p>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Input field with label and error handling
export function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  className = '',
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-md bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
        {...register(name)}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Textarea field with label and error handling
export function TextareaField({
  label,
  name,
  placeholder,
  error,
  register,
  required = false,
  rows = 4,
}: {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  register: any;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-md bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
        {...register(name)}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Select field with label and error handling
export function SelectField({
  label,
  name,
  options,
  error,
  register,
  required = false,
  onChange,
}: {
  label: string;
  name: string;
  options: { value: number | string; label: string }[];
  error?: string;
  register: any;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  // Create a custom register with onChange handler
  const registerWithOnChange = onChange 
    ? { ...register(name), onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Call the provided onChange handler
        onChange(e);
      }}
    : register(name);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        className={`w-full px-4 py-2 rounded-md bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
        {...registerWithOnChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Checkbox field
export function CheckboxField({
  label,
  name,
  register,
}: {
  label: string;
  name: string;
  register: any;
}) {
  return (
    <div className="flex items-center">
      <input
        id={name}
        type="checkbox"
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-700 rounded bg-gray-800"
        {...register(name)}
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-300">
        {label}
      </label>
    </div>
  );
}

// Option card for selection choices
export function OptionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-md cursor-pointer transition-all ${
        selected
          ? 'bg-blue-900/30 border-blue-500 text-white'
          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
      }`}
    >
      <h3 className="font-medium">{label}</h3>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

// Submit button
export function SubmitButton({
  label,
  isLoading,
  disabled,
}: {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`px-6 py-3 rounded-md font-medium text-white transition-colors ${
        disabled
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        label
      )}
    </button>
  );
}

// Transaction status
export function TransactionStatus({
  hash,
  isLoading,
  isSuccess,
  label,
}: {
  hash: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  label: string;
}) {
  return (
    <div className="mt-4 p-4 rounded-md bg-gray-800 border border-gray-700">
      <div className="flex items-center">
        {isLoading ? (
          <div className="rounded-full bg-yellow-500/20 p-2 mr-3">
            <div className="h-5 w-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
          </div>
        ) : isSuccess ? (
          <div className="rounded-full bg-green-500/20 p-2 mr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="rounded-full bg-red-500/20 p-2 mr-3">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-200">{label}</p>
          {hash && (
            <a
              href={`https://mumbai.polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline"
            >
              View transaction
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 