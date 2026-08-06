import React from 'react';
import cx from 'classnames';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, fullWidth, className, ...props }, ref) => {
    return (
      <div className={cx(styles.wrapper, { [styles.fullWidth]: fullWidth }, className)}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input ref={ref} className={cx(styles.input, { [styles.withIcon]: !!icon })} {...props} />
      </div>
    );
  }
);

Input.displayName = 'Input';
