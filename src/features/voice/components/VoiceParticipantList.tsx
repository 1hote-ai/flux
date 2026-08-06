import React from 'react';
import styles from './VoiceParticipantList.module.css';
import { useVoiceStore } from '../store/voiceStore';
import { Avatar } from '../../../components/Avatar/Avatar';
import { MicOff, Headphones } from 'lucide-react';

interface VoiceParticipantListProps {
  channelId: string;
}

export const VoiceParticipantList: React.FC<VoiceParticipantListProps> = ({ channelId }) => {
  const { isConnected, activeChannelId, participants } = useVoiceStore();

  // Show only if connected to this channel, or if we had a real backend, we could show users in ANY channel.
  // For UI testing, we will show participants if activeChannelId matches channelId
  if (!isConnected || activeChannelId !== channelId || participants.length === 0) {
    return null;
  }

  return (
    <div className={styles.participantList}>
      {participants.map(p => (
        <div key={p.id} className={styles.participantItem}>
          <div className={`${styles.avatarContainer} ${p.isSpeaking ? styles.speaking : ''}`}>
            <Avatar src={p.avatar} alt={p.name} size="sm" />
          </div>
          <span className={styles.participantName}>{p.name}</span>
          <div className={styles.statusIcons}>
            {p.isDeafened ? (
              <Headphones size={14} className={styles.deafenedIcon} />
            ) : p.isMuted ? (
              <MicOff size={14} className={styles.mutedIcon} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
