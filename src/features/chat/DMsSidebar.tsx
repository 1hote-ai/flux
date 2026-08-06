import React, { useState } from 'react';
import styles from './DMsSidebar.module.css';
import { useChatStore } from '../../store/useChatStore';
import { Search } from 'lucide-react';

interface DMsSidebarProps {
  onSelect: (id: string) => void;
  activeId: string | null;
}

export const DMsSidebar: React.FC<DMsSidebarProps> = ({ onSelect, activeId }) => {
  const { dialogs } = useChatStore();
  const [search, setSearch] = useState('');

  const filteredDialogs = dialogs.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Найти или начать беседу" 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.dialogList}>
        <div className={styles.sectionTitle}>Личные сообщения</div>
        {filteredDialogs.map(dialog => (
          <div 
            key={dialog.id} 
            className={`${styles.dialogItem} ${activeId === dialog.id ? styles.active : ''}`}
            onClick={() => onSelect(dialog.id)}
          >
            <div className={styles.avatarWrapper}>
              <img src={dialog.avatar} alt={dialog.name} className={styles.avatar} />
              <div className={`${styles.status} ${styles[dialog.status]}`}></div>
            </div>
            <div className={styles.dialogInfo}>
              <span className={styles.dialogName}>{dialog.name}</span>
            </div>
            {dialog.unreadCount > 0 && (
              <div className={styles.unreadBadge}>{dialog.unreadCount}</div>
            )}
          </div>
        ))}
        {filteredDialogs.length === 0 && (
          <div className={styles.emptySearch}>Ничего не найдено</div>
        )}
      </div>
    </div>
  );
};
