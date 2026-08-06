import { Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Channel } from '../store/channelStore';
import { VoiceParticipantList } from '../../voice/components/VoiceParticipantList';
import { useVoiceStore } from '../../voice/store/voiceStore';

interface VoiceChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onConnect: () => void;
}

export function VoiceChannelItem({ channel, isActive, onConnect }: VoiceChannelItemProps) {
  const { connect } = useVoiceStore();

  const handleConnect = () => {
    connect(channel.id);
    onConnect();
  };

  return (
    <div className="flex flex-col mb-[2px]">
      <motion.button
        onClick={handleConnect}
        className={`w-full flex items-center px-2 py-1.5 rounded-md transition-colors ${
          isActive 
            ? 'bg-[rgba(99,102,241,0.15)] text-[var(--accent-primary)]' 
            : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
        }`}
        whileHover={{ translateX: 2 }}
        transition={{ duration: 0.15 }}
      >
        <Volume2 size={18} className="mr-1.5 opacity-70" />
        <span className="truncate text-[15px] font-medium leading-5">{channel.name}</span>
      </motion.button>
      
      <VoiceParticipantList channelId={channel.id} />
    </div>
  );
}
