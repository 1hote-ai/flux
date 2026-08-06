import React from 'react';
import styles from './UserProfileModal.module.css';
import { Modal } from '../../components/Modal/Modal';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';
import { useUIStore, useDataStore } from '../../store/useAppStore';

export const UserProfileModal: React.FC = () => {
  const { isProfileOpen, setProfileOpen } = useUIStore();
  const { currentUser } = useDataStore();

  if (!isProfileOpen || !currentUser) return null;

  return (
    <Modal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} className={styles.profileModal}>
      <div className={styles.banner}>
        <div className={styles.avatarWrapper}>
          <Avatar src={currentUser.avatar} status={currentUser.status} size="xl" className={styles.avatar} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
          <h2 className={styles.username}>{currentUser.name}</h2>
          <span className={styles.tag}>{currentUser.tag || `@${currentUser.username}`}</span>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>О СЕБЕ</h4>
          <p className={styles.bio}>{currentUser.bio}</p>
        </div>
        
        <div className={styles.divider} />

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Эл. почта</span>
            <span className={styles.infoValue}>user@example.com</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Дата регистрации</span>
            <span className={styles.infoValue}>24 мая 2024 г.</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button fullWidth>Редактировать профиль</Button>
        </div>
      </div>
    </Modal>
  );
};
