import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './VoiceRoom.module.css';
import { useVoiceStore } from './store/voiceStore';
import { VoiceParticipantCard } from './components/VoiceParticipantCard';
import { Users } from 'lucide-react';

export const VoiceRoom: React.FC = () => {
  const { voiceId } = useParams();
  const { participants, activeChannelId, isConnected, connect } = useVoiceStore();

  useEffect(() => {
    if (voiceId && activeChannelId !== voiceId) {
      connect(voiceId);
    }
  }, [voiceId, activeChannelId, connect]);

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          Подключение к голосовому каналу...
        </div>
      </div>
    );
  }

  // Calculate grid layout based on participant count
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return styles.grid1;
    if (count === 2) return styles.grid2;
    if (count <= 4) return styles.grid4;
    return styles.gridMany;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Голосовой канал</div>
        <div className={styles.actions}>
          <div className={styles.actionBtn}>
            <Users size={20} />
          </div>
        </div>
      </div>
      
      <div className={styles.gridContainer}>
        <div className={`${styles.grid} ${getGridClass()}`}>
          {participants.map((p: any) => (
            <VoiceParticipantCard 
              key={p.id}
              {...p}
            />
          ))}
        </div>
      </div>
      
      {/* If screen sharing is active, you might render a big screen share view and smaller participants */}
    </div>
  );
};
