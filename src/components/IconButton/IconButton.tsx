import React from 'react';
import cx from 'classnames';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './IconButton.module.css';

interface IconButtonProps extends HTMLMotionProps<'button'> {
  icon: React.ReactNode;
  active?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, active, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cx(styles.iconButton, { [styles.active]: active }, className)}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
