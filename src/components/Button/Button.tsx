import { forwardRef } from 'react';
import cx from 'classnames';
import { motion, type HTMLMotionProps } from 'framer-motion';
import styles from './Button.module.css';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', fullWidth, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cx(
          styles.button,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          { [styles.fullWidth]: fullWidth },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
