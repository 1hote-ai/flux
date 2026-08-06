import React from 'react';
import { motion } from 'framer-motion';
import { ChatArea } from '../features/chat/ChatArea';
import { DMsSidebar } from '../features/chat/DMsSidebar';
import { useChatStore } from '../store/useChatStore';

export const DMsPage: React.FC = () => {
  const { activeDialogId, setActiveDialog } = useChatStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
      <DMsSidebar onSelect={setActiveDialog} activeId={activeDialogId} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
        {activeDialogId ? (
          <ChatArea channelId={activeDialogId} type="dm" />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>👋</div>
            <h3 style={{ color: 'var(--text-normal)', marginBottom: 8 }}>Добро пожаловать в Личные сообщения</h3>
            <p>Выберите диалог слева или начните новый.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
