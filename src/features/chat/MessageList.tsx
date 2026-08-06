import React, { useEffect, useRef } from 'react';
import styles from './MessageList.module.css';
import { MessageCard } from './MessageCard';
import { useChatStore } from '../../store/useChatStore';

interface MessageListProps {
  channelId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ channelId }) => {
  const { messages, isLoadingHistory, loadHistory, deleteMessage } = useChatStore();
  const channelMessages = messages[channelId] || [];
  const isLoading = isLoadingHistory[channelId];
  
  const listRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(channelMessages.length);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (channelMessages.length > prevMessagesLength.current) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
    prevMessagesLength.current = channelMessages.length;
  }, [channelMessages]);

  const handleScroll = () => {
    if (listRef.current) {
      if (listRef.current.scrollTop === 0 && !isLoading) {
        loadHistory(channelId);
      }
    }
  };

  const handleDelete = (messageId: string) => {
    deleteMessage(messageId, channelId);
  };

  if (channelMessages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <h3>Здесь пока нет сообщений</h3>
        <p>Отправьте первое сообщение, чтобы начать беседу.</p>
      </div>
    );
  }

  return (
    <div className={styles.messageList} ref={listRef} onScroll={handleScroll}>
      {isLoading && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <div className={styles.spacer} />
      {channelMessages.map((msg) => (
        <MessageCard key={msg.id} message={msg} onDelete={handleDelete} />
      ))}
    </div>
  );
};
