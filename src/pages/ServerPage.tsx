import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChatArea } from '../features/chat/ChatArea';
import { MemberList } from '../features/server/MemberList';
import { useServerStore } from '../features/servers/store/serverStore';
import { useChannelStore } from '../features/channels/store/channelStore';
import { VoiceRoom } from '../features/voice/VoiceRoom';

export const ServerPage: React.FC = () => {
  const { serverId, channelId, voiceId } = useParams<{ serverId: string, channelId: string, voiceId: string }>();
  const setActiveServer = useServerStore(state => state.setActiveServer);
  const { setActiveChannel, channels } = useChannelStore();

  useEffect(() => {
    if (serverId) setActiveServer(serverId);
    if (channelId) {
      setActiveChannel(channelId);
    } else if (!voiceId) {
      // Auto-select first text channel if no voice channel selected
      const serverChannels = channels.filter(c => c.serverId === serverId && c.type === 'text');
      if (serverChannels.length > 0) {
        setActiveChannel(serverChannels[0].id);
      }
    }
  }, [serverId, channelId, voiceId, setActiveServer, setActiveChannel, channels]);

  const activeChannel = channels.find(c => c.serverId === serverId && (channelId ? c.id === channelId : c.type === 'text'));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', width: '100%', height: '100%' }}
    >
      {voiceId ? (
        <VoiceRoom />
      ) : activeChannel ? (
        <ChatArea channelId={activeChannel.id} type="channel" />
      ) : (
        <div style={{ flex: 1 }} />
      )}
      {!voiceId && <MemberList />}
    </motion.div>
  );
};
