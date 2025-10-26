import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary: 'bg-brand-900 text-white hover:bg-brand-800 shadow-sm',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-100',
  outline: 'border-2 border-brand-300 text-brand-900 hover:bg-brand-100',
};

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}