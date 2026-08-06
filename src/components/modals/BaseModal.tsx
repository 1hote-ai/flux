import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import classNames from 'classnames';

interface BaseModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  hideCloseButton?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({ children, onClose, className, hideCloseButton }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={classNames(
          'relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--divider)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none',
          className
        )}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
};
