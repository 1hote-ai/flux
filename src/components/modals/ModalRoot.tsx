import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../store/modalStore';
import { CreateServerModal } from './CreateServerModal';
import { CreateChannelModal } from './CreateChannelModal';
import { InviteUserModal } from './InviteUserModal';
import { ConfirmModal } from './ConfirmModal';
import { UserProfilePanel } from '../profile/UserProfilePanel';
import { UserSettingsModal } from '../profile/UserSettingsModal';

export const ModalRoot: React.FC = () => {
  const { type, isOpen, closeModal } = useModalStore();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  return (
    <AnimatePresence>
      {isOpen && type === 'CREATE_SERVER' && <CreateServerModal />}
      {isOpen && type === 'CREATE_CHANNEL' && <CreateChannelModal />}
      {isOpen && type === 'INVITE_USER' && <InviteUserModal />}
      {isOpen && type === 'CONFIRM_ACTION' && <ConfirmModal />}
      {isOpen && type === 'USER_PROFILE' && <UserProfilePanel />}
      {isOpen && type === 'USER_SETTINGS' && <UserSettingsModal />}
    </AnimatePresence>
  );
};
