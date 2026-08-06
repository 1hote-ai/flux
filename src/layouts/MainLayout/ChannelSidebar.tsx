import React from 'react';
import styles from './ChannelSidebar.module.css';
import { useDataStore, useUIStore } from '../../store/useAppStore';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, Hash, Volume2 } from 'lucide-react';
import cx from 'classnames';
import { Avatar } from '../../components/Avatar/Avatar';
import { IconButton } from '../../components/IconButton/IconButton';
import { Mic, Headphones, Settings } from 'lucide-react';
import { VoicePanel } from '../../features/voice/VoicePanel';

export const ChannelSidebar: React.FC = () => {
  const { servers, activeServerId, channels, activeChannelId, currentUser } = useDataStore();
  const { setProfileOpen, isChannelSidebarOpen, setChannelSidebarOpen } = useUIStore();
  const location = useLocation();
  const isDMsActive = location.pathname.startsWith('/channels/@me');

  const currentServer = servers.find(s => s.id === activeServerId);
  const serverChannels = channels.filter(c => c.serverId === activeServerId);

  if (isDMsActive) {
    return (
      <>
        {isChannelSidebarOpen && <div className={styles.mobileOverlay} onClick={() => setChannelSidebarOpen(false)} />}
        <aside className={cx(styles.sidebar, { [styles.sidebarHidden]: !isChannelSidebarOpen })}>
          <div className={styles.header}>
            <h2 className={styles.serverName}>Личные сообщения</h2>
          </div>
          <div className={styles.channelList}>
            {/* Mock DM List */}
          </div>
          <UserPanel user={currentUser} onProfileClick={() => setProfileOpen(true)} />
        </aside>
      </>
    );
  }

  return (
    <>
      {isChannelSidebarOpen && <div className={styles.mobileOverlay} onClick={() => setChannelSidebarOpen(false)} />}
      <aside className={cx(styles.sidebar, { [styles.sidebarHidden]: !isChannelSidebarOpen })}>
      <div className={cx(styles.header, styles.serverHeader)}>
        <h2 className={styles.serverName}>{currentServer?.name}</h2>
        <ChevronDown size={18} />
      </div>

      <div className={styles.channelList}>
        <div className={styles.category}>
          <ChevronDown size={12} className={styles.categoryIcon} />
          <span className={styles.categoryName}>ТЕКСТОВЫЕ КАНАЛЫ</span>
        </div>
        {serverChannels.filter(c => c.type === 'text').map(channel => (
          <Link
            key={channel.id}
            to={`/channels/${activeServerId}/${channel.id}`}
            className={cx(styles.channelItem, { [styles.activeChannel]: activeChannelId === channel.id })}
          >
            <Hash size={18} className={styles.channelIcon} />
            <span className={styles.channelName}>{channel.name}</span>
          </Link>
        ))}

        <div className={styles.category} style={{ marginTop: 16 }}>
          <ChevronDown size={12} className={styles.categoryIcon} />
          <span className={styles.categoryName}>ГОЛОСОВЫЕ КАНАЛЫ</span>
        </div>
        {serverChannels.filter(c => c.type === 'voice').map(channel => (
          <Link
            key={channel.id}
            to={`/channels/${activeServerId}/${channel.id}`}
            className={cx(styles.channelItem, { [styles.activeChannel]: activeChannelId === channel.id })}
          >
            <Volume2 size={18} className={styles.channelIcon} />
            <span className={styles.channelName}>{channel.name}</span>
          </Link>
        ))}
      </div>

      <VoicePanel />
      <UserPanel user={currentUser} onProfileClick={() => setProfileOpen(true)} />
    </aside>
    </>
  );
};

const UserPanel: React.FC<{ user: any, onProfileClick: () => void }> = ({ user, onProfileClick }) => {
  return (
    <div className={styles.userPanel}>
      <div className={styles.userInfo} onClick={onProfileClick}>
        <Avatar src={user.avatar} status={user.status} size="md" />
        <div className={styles.userDetails}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userTag}>{user.tag}</div>
        </div>
      </div>
      <div className={styles.userControls}>
        <IconButton icon={<Mic size={18} />} />
        <IconButton icon={<Headphones size={18} />} />
        <IconButton icon={<Settings size={18} />} />
      </div>
    </div>
  );
};
