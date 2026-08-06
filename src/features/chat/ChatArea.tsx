import React from 'react';
import styles from './ChatArea.module.css';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatAreaProps {
  channelId: string;
  type?: 'channel' | 'dm';
}

export const ChatArea: React.FC<ChatAreaProps> = ({ channelId, type = 'channel' }) => {
  return (
    <div className={styles.chatArea}>
      <ChatHeader channelId={channelId} type={type} />
      <MessageList channelId={channelId} />
      <MessageInput channelId={channelId} type={type} />
    </div>
  );
};
