import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ServerTooltip } from './ServerTooltip';
import { useModalStore } from '../../../store/modalStore';

export function CreateServerButton() {
  const [isHovered, setIsHovered] = useState(false);
  const openModal = useModalStore(state => state.openModal);

  return (
    <div className="relative flex items-center justify-center w-[72px] h-[48px] mt-2 mb-2">
      <ServerTooltip text="Добавить сервер" isVisible={isHovered}>
        <motion.button
          onClick={() => openModal('CREATE_SERVER')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-[48px] h-[48px] overflow-hidden flex items-center justify-center text-[#23A559] bg-[var(--bg-tertiary)] transition-colors duration-200"
          animate={{
            borderRadius: isHovered ? '16px' : '24px',
            backgroundColor: isHovered ? '#23A559' : 'var(--bg-tertiary)',
            color: isHovered ? 'white' : '#23A559',
          }}
        >
          <Plus size={24} />
        </motion.button>
      </ServerTooltip>
    </div>
  );
}
