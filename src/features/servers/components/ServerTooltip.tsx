import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface ServerTooltipProps {
  text: string;
  isVisible: boolean;
  children: ReactNode;
}

export function ServerTooltip({ text, isVisible, children }: ServerTooltipProps) {
  return (
    <div className="relative flex items-center group">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-[72px] z-50 whitespace-nowrap bg-black text-white text-[15px] font-semibold py-2 px-3 rounded-lg shadow-xl"
            style={{ 
              boxShadow: '0 8px 16px rgba(0,0,0,0.24)',
            }}
          >
            {text}
            {/* Arrow */}
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[5px] border-r-black border-b-[5px] border-b-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
