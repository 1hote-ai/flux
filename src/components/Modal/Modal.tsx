import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'classnames';
import styles from './Modal.module.css';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import { IconButton } from '../IconButton/IconButton';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlayWrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.backdrop}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cx(styles.modalContainer, className)}
          >
            <GlassPanel className={styles.modalContent}>
              <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                <IconButton icon={<X size={18} />} onClick={onClose} className={styles.closeButton} />
              </div>
              <div className={styles.body}>
                {children}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
