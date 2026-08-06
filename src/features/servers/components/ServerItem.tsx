import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Server } from '../store/serverStore';
import { ServerTooltip } from './ServerTooltip';

interface ServerItemProps {
  server: Server;
  isActive: boolean;
  onClick: () => void;
}

export function ServerItem({ server, isActive, onClick }: ServerItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Определение высоты пилюли-индикатора
  let pillHeight = 8;
  if (isActive) pillHeight = 40;
  else if (isHovered || server.hasUnread) pillHeight = 20;
  else if (!server.hasUnread) pillHeight = 0;

  return (
    <div className="relative flex items-center justify-center w-[72px] h-[48px] mb-2">
      {/* Пилюля активности */}
      <div className="absolute left-0 flex items-center h-full w-[4px]">
        <motion.div
          animate={{ height: pillHeight }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full bg-white rounded-r-[4px]"
        />
      </div>

      {/* Иконка сервера + Tooltip */}
      <ServerTooltip text={server.name} isVisible={isHovered}>
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-[48px] h-[48px] overflow-hidden flex items-center justify-center text-white bg-[var(--bg-tertiary)] transition-colors duration-200"
          animate={{
            borderRadius: isActive || isHovered ? '16px' : '24px',
            backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
            color: isActive ? 'white' : 'var(--text-primary)',
          }}
          whileHover={{
            backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--accent-primary)',
          }}
        >
          {server.icon ? (
            <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[15px] font-medium leading-none">
              {server.name.split(' ').map((n) => n[0]).join('').substring(0, 3)}
            </span>
          )}

          {/* Mentions Badge */}
          {server.mentions && server.mentions > 0 && (
            <div className="absolute bottom-[-2px] right-[-2px] border-[3px] border-[var(--bg-secondary)] bg-[#EF4444] text-white text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {server.mentions > 99 ? '99+' : server.mentions}
            </div>
          )}
        </motion.button>
      </ServerTooltip>
    </div>
  );
}
