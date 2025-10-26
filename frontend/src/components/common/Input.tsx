import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className = '', ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-brand-800">{label}</span>}
      <input
        className={`w-full rounded-lg border-2 border-brand-200 bg-white px-4 py-2.5 text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition ${className}`}
        {...rest}
      />
      {error && <span className="mt-1.5 block text-xs text-accent-600">{error}</span>}
    </label>
  );
}