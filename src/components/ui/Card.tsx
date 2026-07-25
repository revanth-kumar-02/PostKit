import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl bg-zinc-900/80 p-4 backdrop-blur-sm';
  const variantStyles = {
    default: 'shadow-lg border border-zinc-800/80',
    bordered: 'border border-zinc-700/80',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
