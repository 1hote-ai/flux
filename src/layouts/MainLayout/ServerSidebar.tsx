import React from 'react';
import styles from './ServerSidebar.module.css';
import { useDataStore } from '../../store/useAppStore';
import { Avatar } from '../../components/Avatar/Avatar';
import { Link, useLocation } from 'react-router-dom';
import cx from 'classnames';

export const ServerSidebar: React.FC = () => {
  const { servers, activeServerId } = useDataStore();
  const location = useLocation();

  const isDMsActive = location.pathname.startsWith('/channels/@me');

  return (
    <nav className={styles.sidebar}>
      <Link to="/channels/@me" className={styles.serverLink}>
        <div className={styles.pillContainer}>
          <div className={cx(styles.pill, { [styles.activePill]: isDMsActive, [styles.hoverPill]: !isDMsActive })} />
        </div>
        <Avatar alt="DMs" src="https://api.dicebear.com/7.x/identicon/svg?seed=Discord" size="lg" className={cx(styles.icon, { [styles.activeIcon]: isDMsActive })} />
      </Link>
      
      <div className={styles.separator} />

      {servers.map(server => {
        const isActive = activeServerId === server.id && !isDMsActive;
        return (
          <Link key={server.id} to={`/channels/${server.id}`} className={styles.serverLink}>
            <div className={styles.pillContainer}>
              <div className={cx(styles.pill, { [styles.activePill]: isActive, [styles.hoverPill]: !isActive })} />
            </div>
            <Avatar alt={server.name} src={server.icon} size="lg" className={cx(styles.icon, { [styles.activeIcon]: isActive })} />
          </Link>
        );
      })}
    </nav>
  );
};
