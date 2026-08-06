import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { useModalStore } from '../../store/modalStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Server } from 'lucide-react';

export const CreateServerModal: React.FC = () => {
  const { closeModal } = useModalStore();
  const [serverName, setServerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      closeModal();
    }, 800);
  };

  return (
    <BaseModal onClose={closeModal}>
      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-[var(--radius-xl)] flex items-center justify-center mb-4 border border-[var(--divider)] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Server size={32} className="text-[var(--accent-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-center">Создайте свой сервер</h2>
          <p className="text-[var(--text-secondary)] text-center text-sm mt-2">
            Сервер — это место, где вы и ваши друзья можете общаться. Создайте его и начните общение!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input 
            label="Название сервера" 
            placeholder="Сервер пользователя Flux"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            autoFocus
          />
          
          <div className="flex justify-between items-center bg-[var(--bg-base)] -mx-6 -mb-6 p-4 border-t border-[var(--divider)]">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Назад
            </Button>
            <Button type="submit" disabled={!serverName.trim() || isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};
