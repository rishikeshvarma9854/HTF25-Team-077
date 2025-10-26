import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className = '', children, ...rest }: Props) {
  return (
    <div className={`rounded-2xl border border-brand-200 bg-white p-6 shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}