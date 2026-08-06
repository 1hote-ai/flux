import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '../../servers/store/serverStore';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId?: string;
}

export function InviteUserModal({ isOpen, onClose, serverId }: InviteUserModalProps) {
  const [copied, setCopied] = useState(false);
  const { servers } = useServerStore();
  
  const server = servers.find(s => s.id === serverId);
  const inviteLink = `https://flux.app/invite/${serverId || 'temp123'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[440px] bg-[var(--bg-primary)] rounded-[20px] shadow-2xl overflow-hidden border border-[var(--glass-border)]"
          >
            <div className="p-6">
              <button onClick={onClose} className="absolute right-4 top-4 text-[var(--text-secondary)] hover:text-white transition-colors">
                <X size={20} />
              </button>
              
              <h2 className="text-lg font-bold text-white mb-2">
                Пригласить друзей в {server?.name || 'Сервер'}
              </h2>
              
              <div className="mt-6">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                  ИЛИ ОТПРАВЬТЕ ЭТУ ССЫЛКУ ДРУЗЬЯМ
                </label>
                <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-md border border-[var(--glass-border)]">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="w-full bg-transparent text-white px-2 py-1.5 outline-none text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                      copied ? 'bg-[#23A559] text-white' : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Скопировано' : 'Копировать'}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  Ваша ссылка-приглашение никогда не истечет.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
