import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import type { ChannelCategory as IChannelCategory } from '../store/channelStore';
import { useModalStore } from '../../../store/modalStore';

interface ChannelCategoryProps {
  category: IChannelCategory;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function ChannelCategory({ category, isCollapsed, onToggle, children }: ChannelCategoryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const openModal = useModalStore(state => state.openModal);

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between pr-2 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex items-center flex-1 text-[12px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight size={12} className="mr-0.5" />
          ) : (
            <ChevronDown size={12} className="mr-0.5" />
          )}
          <span className="uppercase tracking-wider select-none">{category.name}</span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            openModal('CREATE_CHANNEL');
          }}
          className={`text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <Plus size={16} />
        </button>
      </div>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
