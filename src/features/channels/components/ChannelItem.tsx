import { Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Channel } from '../store/channelStore';

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

export function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center px-2 py-1.5 mb-[2px] rounded-md transition-colors ${
        isActive 
          ? 'bg-[rgba(255,255,255,0.1)] text-white' 
          : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
      }`}
      whileHover={{ translateX: 2 }}
      transition={{ duration: 0.15 }}
    >
      <Hash size={18} className="mr-1.5 opacity-70" />
      <span className="truncate text-[15px] font-medium leading-5">{channel.name}</span>
    </motion.button>
  );
}
