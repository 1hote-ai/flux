import React from 'react';
import cx from 'classnames';
import styles from './GlassPanel.module.css';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className }) => {
  return (
    <div className={cx(styles.panel, className)}>
      {children}
    </div>
  );
};
