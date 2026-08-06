import React from 'react';
import { Modal } from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать сервер">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
        Ваш сервер — это то место, где вы можете общаться с друзьями. Создайте свой сервер и начните общение!
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Название сервера</label>
          <Input placeholder="Мой крутой сервер" fullWidth />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="primary">Создать</Button>
        </div>
      </div>
    </Modal>
  );
};
