import React, { useState } from 'react';
import { BaseModal } from '../modals/BaseModal';
import { useModalStore } from '../../store/modalStore';
import { useUserStore } from '../../store/userStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Camera } from 'lucide-react';

export const UserProfilePanel: React.FC = () => {
  const { closeModal } = useModalStore();
  const { currentUser, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || '');
  const [customStatus, setCustomStatus] = useState(currentUser?.customStatus || '');

  if (!currentUser) return null;

  const handleSave = () => {
    updateUser({ username, customStatus });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'var(--status-online)';
      case 'idle': return 'var(--status-idle)';
      case 'dnd': return 'var(--status-dnd)';
      default: return 'var(--status-offline)';
    }
  };

  return (
    <BaseModal onClose={closeModal} className="max-w-md p-0 overflow-visible">
      {/* Banner */}
      <div className="h-32 bg-[var(--accent-primary)] rounded-t-[var(--radius-xl)] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 relative bg-[var(--bg-secondary)] rounded-b-[var(--radius-xl)]">
        {/* Avatar Area */}
        <div className="absolute -top-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-secondary)] bg-[var(--bg-tertiary)] overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-[var(--accent-primary)]">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Status Indicator */}
            <div 
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-[var(--bg-secondary)]"
              style={{ backgroundColor: getStatusColor(currentUser.status) }}
            />
            
            {/* Edit Avatar overlay */}
            {isEditing && (
              <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity m-1">
                <Camera size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-3 pb-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Отмена</Button>
              <Button size="sm" onClick={handleSave}>Сохранить</Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              Редактировать профиль
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="mt-4 bg-[var(--bg-base)] rounded-[var(--radius-lg)] p-4 border border-[var(--divider)] shadow-inner">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <Input 
                label="Имя пользователя" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
              <Input 
                label="Пользовательский статус" 
                value={customStatus} 
                onChange={(e) => setCustomStatus(e.target.value)} 
                placeholder="Что у вас нового?"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{currentUser.username}</h2>
              {currentUser.customStatus && (
                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(currentUser.status) }} />
                  {currentUser.customStatus}
                </p>
              )}
              <div className="h-px bg-[var(--divider)] my-2" />
              <div className="text-xs uppercase font-bold text-[var(--text-muted)]">О себе</div>
              <p className="text-sm text-[var(--text-secondary)]">Разработчик, энтузиаст UI/UX. Люблю создавать красивые интерфейсы со стеклом и свечением!</p>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};
