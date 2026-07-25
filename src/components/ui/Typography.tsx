import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'muted';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  as = 'p',
  variant = 'body',
  children,
  className = '',
  ...props
}) => {
  const Component = as;

  const variantStyles = {
    h1: 'text-2xl font-bold tracking-tight text-zinc-100',
    h2: 'text-xl font-semibold tracking-tight text-zinc-100',
    h3: 'text-lg font-medium text-zinc-200',
    body: 'text-sm text-zinc-300 leading-relaxed',
    caption: 'text-xs text-zinc-400',
    muted: 'text-xs text-zinc-500',
  };

  return (
    <Component className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};
