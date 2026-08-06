import React from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Пригласить друзей">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Отправьте ссылку-приглашение своим друзьям, чтобы они присоединились к серверу.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input value="https://flux.app/join/xyz123" readOnly fullWidth />
          <Button variant="primary">Копировать</Button>
        </div>
      </div>
    </Modal>
  );
};
