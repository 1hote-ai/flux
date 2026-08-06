import React, { useState } from 'react';
import styles from './MessageInput.module.css';
import { Plus, Gift, FileText, Smile, Send } from 'lucide-react';
import { IconButton } from '../../components/IconButton/IconButton';
import { useDataStore } from '../../store/useAppStore';
import { useChatStore } from '../../store/useChatStore';

interface MessageInputProps {
  channelId: string;
  type: 'channel' | 'dm';
}

export const MessageInput: React.FC<MessageInputProps> = ({ channelId, type }) => {
  const { channels, currentUser } = useDataStore();
  const { dialogs, sendMessage } = useChatStore();
  const [text, setText] = useState('');

  const channel = channels.find(c => c.id === channelId);
  const dialog = dialogs.find(d => d.id === channelId);
  
  const placeholder = type === 'channel' 
    ? `Написать в #${channel?.name || 'канал'}` 
    : `Написать @${dialog?.name || 'пользователю'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(channelId, currentUser.id, currentUser.name, currentUser.avatar, text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <IconButton icon={<Plus size={20} />} className={styles.actionBtn} />
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
        />
        <div className={styles.actions}>
          {text.length > 0 ? (
            <IconButton icon={<Send size={20} />} onClick={handleSubmit} />
          ) : (
            <>
              <IconButton icon={<Gift size={20} />} />
              <IconButton icon={<FileText size={20} />} />
              <IconButton icon={<Smile size={20} />} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};
