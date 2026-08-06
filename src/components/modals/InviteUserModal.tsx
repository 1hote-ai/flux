import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { useModalStore } from '../../store/modalStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Copy, Check } from 'lucide-react';

export const InviteUserModal: React.FC = () => {
  const { closeModal } = useModalStore();
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://flux.chat/invite/xyz123abc';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseModal onClose={closeModal}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Пригласить друзей</h2>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          Поделитесь этой ссылкой с другими, чтобы предоставить им доступ.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Ссылка-приглашение
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input 
                value={inviteLink}
                readOnly
                className="bg-[var(--bg-base)] text-[var(--accent-primary)] font-medium"
              />
            </div>
            <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'} className="min-w-[100px]">
              {copied ? (
                <span className="flex items-center gap-2"><Check size={16} /> Копия</span>
              ) : (
                <span className="flex items-center gap-2"><Copy size={16} /> Копировать</span>
              )}
            </Button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Эта ссылка никогда не истечет.</p>
        </div>
      </div>
    </BaseModal>
  );
};
