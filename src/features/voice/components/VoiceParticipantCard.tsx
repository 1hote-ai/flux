import React from 'react';
import styles from './VoiceParticipantCard.module.css';
import { Avatar } from '../../../components/Avatar/Avatar';
import { MicOff, Headphones } from 'lucide-react';

interface VoiceParticipantCardProps {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

export const VoiceParticipantCard: React.FC<VoiceParticipantCardProps> = ({
  name,
  avatar,
  isSpeaking,
  isMuted,
  isDeafened
}) => {
  return (
    <div className={`${styles.card} ${isSpeaking ? styles.speaking : ''}`}>
      <div className={styles.avatarWrapper}>
        <Avatar src={avatar} alt={name} size="xl" />
      </div>
      
      <div className={styles.userInfo}>
        <span className={styles.name}>{name}</span>
        
        <div className={styles.statusIcons}>
          {isDeafened && (
            <div className={styles.iconWrapper}>
              <Headphones size={14} />
            </div>
          )}
          {isMuted && !isDeafened && (
            <div className={styles.iconWrapper}>
              <MicOff size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
