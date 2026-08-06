import { useNavigate, useParams } from 'react-router-dom';
import { useChannelStore } from '../store/channelStore';
import { useServerStore } from '../../servers/store/serverStore';
import { ChannelCategory } from './ChannelCategory';
import { ChannelItem } from './ChannelItem';
import { VoiceChannelItem } from './VoiceChannelItem';
import { ChevronDown, Settings, Mic, Headphones } from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { useModalStore } from '../../../store/modalStore';
import { VoicePanel } from '../../voice/VoicePanel';

export function ChannelSidebar({ serverId }: { serverId?: string }) {
  const navigate = useNavigate();
  const { channelId, voiceId } = useParams();
  
  const { servers, collapsedCategories, toggleCategory } = useServerStore();
  const { channels, categories, activeChannelId, setActiveChannel, activeVoiceChannelId, setActiveVoiceChannel } = useChannelStore();
  const { currentUser } = useUserStore();
  const { openModal } = useModalStore();

  const currentServerId = serverId;
  const currentServer = servers.find(s => s.id === currentServerId);

  if (!currentServerId || !currentServer) {
    return (
      <div className="hidden md:flex w-[240px] h-full bg-[var(--bg-secondary)] flex-col border-r border-[var(--divider)] border-opacity-5">
         {/* DMs Header can go here */}
         <div className="h-12 border-b border-[var(--divider)] shadow-sm flex items-center px-4 font-semibold">
           Личные сообщения
         </div>
         <div className="flex-1"></div>
         <UserProfileBar currentUser={currentUser} openModal={openModal} />
      </div>
    );
  }

  const serverCategories = categories.filter(c => c.serverId === currentServerId);
  const serverChannels = channels.filter(c => c.serverId === currentServerId);
  const serverCollapsed = collapsedCategories[currentServerId] || [];

  const handleChannelClick = (id: string) => {
    setActiveChannel(id);
    navigate(`/channels/${currentServerId}/${id}`);
  };

  const handleVoiceConnect = (id: string) => {
    setActiveVoiceChannel(id);
    navigate(`/channels/${currentServerId}/voice/${id}`);
  };

  return (
    <div className="hidden md:flex w-[240px] h-full bg-[var(--bg-secondary)] flex-col border-r border-[var(--divider)] border-opacity-5">
      {/* Header сервера */}
      <div 
        className="h-12 min-h-[48px] border-b border-[var(--divider)] shadow-sm flex items-center justify-between px-4 font-semibold cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
        onClick={() => openModal('INVITE_USER')}
      >
        <span className="truncate">{currentServer.name}</span>
        <ChevronDown size={18} className="opacity-70" />
      </div>

      {/* Список каналов */}
      <div className="flex-1 overflow-y-auto px-2 py-3" style={{ scrollbarWidth: 'none' }}>
        {serverCategories.map((category) => {
          const categoryChannels = serverChannels.filter(ch => ch.categoryId === category.id);
          const isCollapsed = serverCollapsed.includes(category.id);
          
          return (
            <ChannelCategory 
              key={category.id} 
              category={category} 
              isCollapsed={isCollapsed}
              onToggle={() => toggleCategory(currentServerId, category.id)}
            >
              {categoryChannels.map(channel => {
                if (channel.type === 'text') {
                  return (
                    <ChannelItem 
                      key={channel.id}
                      channel={channel}
                      isActive={channelId === channel.id || activeChannelId === channel.id}
                      onClick={() => handleChannelClick(channel.id)}
                    />
                  );
                }
                if (channel.type === 'voice') {
                  return (
                    <VoiceChannelItem 
                      key={channel.id}
                      channel={channel}
                      isActive={voiceId === channel.id || activeVoiceChannelId === channel.id}
                      onConnect={() => handleVoiceConnect(channel.id)}
                    />
                  );
                }
                return null;
              })}
            </ChannelCategory>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col shrink-0">
        <VoicePanel />
        <UserProfileBar currentUser={currentUser} openModal={openModal} />
      </div>
    </div>
  );
}

function UserProfileBar({ currentUser, openModal }: { currentUser: any, openModal: any }) {
  if (!currentUser) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--status-online)';
      case 'idle': return 'var(--status-idle)';
      case 'dnd': return 'var(--status-dnd)';
      default: return 'var(--status-offline)';
    }
  };

  return (
    <div className="h-[52px] bg-[rgba(0,0,0,0.1)] border-t border-[var(--divider)] flex items-center justify-between px-2 shrink-0">
      <button 
        className="flex items-center gap-2 flex-1 p-1 rounded hover:bg-[rgba(255,255,255,0.05)] transition-colors text-left"
        onClick={() => openModal('USER_PROFILE')}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold">{currentUser.username[0]}</span>
            )}
          </div>
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--bg-secondary)]"
            style={{ backgroundColor: getStatusColor(currentUser.status) }}
          />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-sm font-semibold truncate leading-tight">{currentUser.username}</span>
          <span className="text-xs text-[var(--text-secondary)] truncate leading-tight">
            {currentUser.customStatus || currentUser.status}
          </span>
        </div>
      </button>

      <div className="flex items-center">
        <button 
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] rounded"
          onClick={() => {}}
        >
          <Mic size={18} />
        </button>
        <button 
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] rounded"
          onClick={() => {}}
        >
          <Headphones size={18} />
        </button>
        <button 
          className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)] rounded"
          onClick={() => openModal('USER_SETTINGS')}
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
}
