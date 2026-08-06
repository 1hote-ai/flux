import { useState } from 'react';
import styles from './MessageCard.module.css';
import type { Message } from '../../store/useChatStore';

interface MessageCardProps {
  message: Message;
  onDelete: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      className={styles.messageCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.avatarContainer}>
        {message.authorAvatar ? (
          <img src={message.authorAvatar} alt={message.authorName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{message.authorName.charAt(0)}</div>
        )}
      </div>
      
      <div className={styles.messageContent}>
        <div className={styles.messageHeader}>
          <span className={styles.authorName}>{message.authorName}</span>
          <span className={styles.timestamp}>{formattedTime}</span>
        </div>
        
        <div className={styles.messageText}>
          {message.content}
        </div>
      </div>

      {isHovered && (
        <div className={styles.actionPanel}>
          <button className={styles.actionButton} title="Ответить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 17 4 12 9 7"></polyline>
              <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
            </svg>
          </button>
          <button className={styles.actionButton} title="Удалить" onClick={() => onDelete(message.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
