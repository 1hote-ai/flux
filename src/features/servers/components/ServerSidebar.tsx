import { useNavigate, useParams } from 'react-router-dom';
import { useServerStore } from '../store/serverStore';
import { ServerItem } from './ServerItem';
import { CreateServerButton } from './CreateServerButton';
import { ServerTooltip } from './ServerTooltip';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export function ServerSidebar() {
  const { servers, activeServerId, setActiveServer } = useServerStore();
  const navigate = useNavigate();
  const { serverId } = useParams();
  
  // Активный сервер должен соответствовать URL (или "dms" для личных сообщений)
  const currentId = serverId || (window.location.pathname.includes('/@me') ? '@me' : activeServerId);

  const handleServerClick = (id: string) => {
    setActiveServer(id);
    navigate(`/channels/${id}`);
  };

  const handleDMsClick = () => {
    setActiveServer(null);
    navigate('/channels/@me');
  };

  const isDMsActive = currentId === '@me';

  return (
    <div className="hidden md:flex w-[72px] h-full flex-col items-center py-3 bg-[var(--bg-base)] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
      
      {/* DMs / Home Button */}
      <DMsButton isActive={isDMsActive} onClick={handleDMsClick} />
      
      {/* Разделитель */}
      <div className="w-8 h-[2px] bg-[var(--divider)] rounded-full my-2 flex-shrink-0" />

      {/* Список серверов */}
      <div className="flex flex-col items-center flex-1 w-full">
        {servers.map((server) => (
          <ServerItem
            key={server.id}
            server={server}
            isActive={currentId === server.id}
            onClick={() => handleServerClick(server.id)}
          />
        ))}
        <CreateServerButton />
      </div>
    </div>
  );
}

// Вынесем кнопку Личных сообщений для чистоты
function DMsButton({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  let pillHeight = 8;
  if (isActive) pillHeight = 40;
  else if (isHovered) pillHeight = 20;
  else pillHeight = 0;

  return (
    <div className="relative flex items-center justify-center w-[72px] h-[48px]">
      <div className="absolute left-0 flex items-center h-full w-[4px]">
        <motion.div
          animate={{ height: pillHeight }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-full bg-white rounded-r-[4px]"
        />
      </div>

      <ServerTooltip text="Личные сообщения" isVisible={isHovered}>
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-[48px] h-[48px] overflow-hidden flex items-center justify-center text-white bg-[var(--bg-tertiary)] transition-colors duration-200"
          animate={{
            borderRadius: isActive || isHovered ? '16px' : '24px',
            backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          }}
          whileHover={{
            backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--accent-primary)',
          }}
        >
          <MessageSquare size={24} />
        </motion.button>
      </ServerTooltip>
    </div>
  );
}
