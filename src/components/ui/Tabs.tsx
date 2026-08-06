import React from 'react';
import classNames from 'classnames';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, orientation = 'horizontal' }) => {
  return (
    <div 
      className={classNames(
        'flex',
        orientation === 'horizontal' ? 'flex-row gap-4 border-b border-[var(--divider)]' : 'flex-col gap-2'
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={classNames(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative outline-none',
              orientation === 'horizontal' ? 'pb-3' : 'rounded-[var(--radius-md)] w-full text-left',
              isActive 
                ? 'text-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.02)]'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {isActive && orientation === 'horizontal' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] shadow-[0_-2px_10px_var(--accent-glow)] rounded-t-full" />
            )}
            {isActive && orientation === 'vertical' && (
              <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-10 rounded-[var(--radius-md)] pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
};
