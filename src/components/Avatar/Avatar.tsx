import React from 'react';
import cx from 'classnames';
import styles from './Avatar.module.css';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', status, className, onClick }) => {
  return (
    <div className={cx(styles.wrapper, styles[`size-${size}`], className)} onClick={onClick}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </div>
      )}
      {status && status !== 'offline' && (
        <div className={cx(styles.status, styles[`status-${status}`])} />
      )}
    </div>
  );
};
