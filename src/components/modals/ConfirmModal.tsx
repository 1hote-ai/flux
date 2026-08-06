import React from 'react';
import { BaseModal } from './BaseModal';
import { useModalStore } from '../../store/modalStore';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { data, closeModal } = useModalStore();
  const { title = 'Подтвердите действие', description = 'Вы уверены?', onConfirm } = data;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  return (
    <BaseModal onClose={closeModal} className="max-w-sm">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-[var(--status-dnd)]" />
        </div>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6">{description}</p>
        
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={closeModal} fullWidth>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleConfirm} fullWidth>
            Подтвердить
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
