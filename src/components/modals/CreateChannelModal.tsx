import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { useModalStore } from '../../store/modalStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Hash, Mic } from 'lucide-react';
import classNames from 'classnames';

export const CreateChannelModal: React.FC = () => {
  const { closeModal } = useModalStore();
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;
    // Simulate creation
    closeModal();
  };

  return (
    <BaseModal onClose={closeModal}>
      <div className="p-6 pb-0">
        <h2 className="text-xl font-bold mb-2">Создать канал</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          В каком канале вы хотите общаться?
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Тип канала</label>
            
            {/* Text Channel Option */}
            <button
              type="button"
              onClick={() => setChannelType('text')}
              className={classNames(
                'flex items-center gap-3 p-3 rounded-[var(--radius-md)] border transition-all text-left',
                channelType === 'text' 
                  ? 'bg-[var(--bg-tertiary)] border-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]' 
                  : 'bg-[var(--bg-base)] border-[var(--divider)] hover:bg-[var(--bg-tertiary)]'
              )}
            >
              <Hash size={24} className="text-[var(--text-secondary)]" />
              <div>
                <div className="font-medium">Текстовый канал</div>
                <div className="text-xs text-[var(--text-secondary)]">Отправляйте сообщения, картинки, стикеры.</div>
              </div>
            </button>

            {/* Voice Channel Option */}
            <button
              type="button"
              onClick={() => setChannelType('voice')}
              className={classNames(
                'flex items-center gap-3 p-3 rounded-[var(--radius-md)] border transition-all text-left',
                channelType === 'voice' 
                  ? 'bg-[var(--bg-tertiary)] border-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]' 
                  : 'bg-[var(--bg-base)] border-[var(--divider)] hover:bg-[var(--bg-tertiary)]'
              )}
            >
              <Mic size={24} className="text-[var(--text-secondary)]" />
              <div>
                <div className="font-medium">Голосовой канал</div>
                <div className="text-xs text-[var(--text-secondary)]">Общайтесь голосом, видео и делитесь экраном.</div>
              </div>
            </button>
          </div>

          <Input 
            label="Название канала" 
            placeholder="новые-идеи"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
          
          <div className="flex justify-end gap-3 bg-[var(--bg-base)] -mx-6 p-4 mt-2 border-t border-[var(--divider)]">
            <Button variant="ghost" type="button" onClick={closeModal}>Отмена</Button>
            <Button type="submit" disabled={!channelName.trim()}>Создать канал</Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};
