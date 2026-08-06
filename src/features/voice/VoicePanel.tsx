import React from 'react';
import styles from './VoicePanel.module.css';
import { 
  PhoneOff, 
  Video, 
  VideoOff, 
  MonitorUp, 
  SignalHigh, 
  Mic, 
  MicOff, 
  Headphones 
} from 'lucide-react';
import { IconButton } from '../../components/IconButton/IconButton';
import { useVoiceStore } from './store/voiceStore';
import { useServerStore } from '../servers/store/serverStore';

export const VoicePanel: React.FC = () => {
  const { 
    isConnected, 
    isMuted, 
    isDeafened, 
    isVideoEnabled, 
    isScreenSharing,
    disconnect,
    toggleMute,
    toggleDeafen,
    toggleVideo,
    toggleScreenShare
  } = useVoiceStore();
  
  const { servers, activeServerId } = useServerStore();
  
  if (!isConnected) return null;

  const server = servers.find(s => s.id === activeServerId);
  const serverName = server ? server.name : 'Unknown Server';
  // TODO: get real channel name by activeChannelId if available

  return (
    <div className={styles.voicePanel}>
      <div className={styles.connectionInfo}>
        <SignalHigh size={16} className={styles.signalIcon} />
        <div className={styles.details}>
          <div className={styles.status}>Голосовая связь подключена</div>
          <div className={styles.channelName}>Голосовой канал / {serverName}</div>
        </div>
        <IconButton 
          icon={<PhoneOff size={18} />} 
          className={styles.disconnectBtn} 
          onClick={disconnect}
          title="Отключиться"
        />
      </div>
      <div className={styles.controls}>
        <IconButton 
          icon={isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />} 
          className={`${styles.controlBtn} ${!isVideoEnabled ? styles.offState : ''}`} 
          onClick={toggleVideo}
          title="Камера"
        />
        <IconButton 
          icon={<MonitorUp size={18} />} 
          className={`${styles.controlBtn} ${isScreenSharing ? styles.activeState : ''}`} 
          onClick={toggleScreenShare}
          title="Демонстрация экрана"
        />
        <IconButton 
          icon={isMuted ? <MicOff size={18} /> : <Mic size={18} />} 
          className={`${styles.controlBtn} ${isMuted ? styles.offState : ''}`} 
          onClick={toggleMute}
          title={isMuted ? "Включить микрофон" : "Выключить микрофон"}
        />
        <IconButton 
          icon={isDeafened ? <Headphones size={18} style={{color: 'var(--status-dnd)'}} /> : <Headphones size={18} />} 
          className={`${styles.controlBtn} ${isDeafened ? styles.offState : ''}`} 
          onClick={toggleDeafen}
          title={isDeafened ? "Включить звук" : "Выключить звук"}
        />
      </div>
    </div>
  );
};
