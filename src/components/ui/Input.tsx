import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>}
      <input
        className={classNames(
          'w-full bg-[var(--bg-tertiary)] border border-[var(--divider)] rounded-[var(--radius-md)] px-4 py-2 text-[var(--text-primary)] text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:shadow-[0_0_10px_var(--accent-glow)]',
          error && 'border-[var(--status-dnd)] focus:border-[var(--status-dnd)] focus:shadow-[0_0_10px_rgba(239,68,68,0.4)]',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-[var(--status-dnd)]">{error}</span>}
    </div>
  );
};
