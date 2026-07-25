import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  rows = 5,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
};
