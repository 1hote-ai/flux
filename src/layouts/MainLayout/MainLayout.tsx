import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { ServerSidebar } from '../../features/servers/components/ServerSidebar';
import { ChannelSidebar } from '../../features/channels/components/ChannelSidebar';
import { useServerStore } from '../../features/servers/store/serverStore';

export const MainLayout: React.FC = () => {
  const { activeServerId } = useServerStore();

  return (
    <div className={styles.layout} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <ServerSidebar />
      <ChannelSidebar serverId={activeServerId || undefined} />
      
      <main className={styles.mainArea} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
};
