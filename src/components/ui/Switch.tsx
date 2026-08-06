import React from 'react';
import classNames from 'classnames';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="flex flex-col gap-0.5">
        {label && <span className="text-[var(--text-primary)] font-medium text-sm">{label}</span>}
        {description && <span className="text-[var(--text-secondary)] text-xs">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={classNames(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]',
          checked ? 'bg-[var(--status-online)] shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-[var(--bg-tertiary)]'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
