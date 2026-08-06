import React from 'react';
import styles from './ChatHeader.module.css';
import { Hash, Bell, Users, Search, Inbox, HelpCircle, Menu, AtSign } from 'lucide-react';
import { useDataStore } from '../../store/useAppStore';
import { useUIStore } from '../../store/useAppStore';
import { useChatStore } from '../../store/useChatStore';
import { IconButton } from '../../components/IconButton/IconButton';
import { Input } from '../../components/Input/Input';

interface ChatHeaderProps {
  channelId: string;
  type: 'channel' | 'dm';
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ channelId, type }) => {
  const { channels } = useDataStore();
  const { dialogs } = useChatStore();
  const { setChannelSidebarOpen } = useUIStore();
  
  const channel = channels.find(c => c.id === channelId);
  const dialog = dialogs.find(d => d.id === channelId);

  const title = type === 'channel' ? channel?.name : dialog?.name;
  const icon = type === 'channel' ? <Hash size={24} className={styles.icon} /> : <AtSign size={24} className={styles.icon} />;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <IconButton 
          icon={<Menu size={24} />} 
          className={styles.mobileMenuBtn} 
          onClick={() => setChannelSidebarOpen(true)} 
        />
        {icon}
        <h3 className={styles.title}>{title || 'Загрузка...'}</h3>
      </div>
      <div className={styles.right}>
        <IconButton icon={<Bell size={20} />} />
        <IconButton icon={<Users size={20} />} active />
        <div className={styles.searchWrapper}>
          <Input placeholder="Поиск" className={styles.searchInput} icon={<Search size={16} />} />
        </div>
        <IconButton icon={<Inbox size={20} />} />
        <IconButton icon={<HelpCircle size={20} />} />
      </div>
    </header>
  );
};
