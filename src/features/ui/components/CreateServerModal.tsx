import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useServerStore } from '../../servers/store/serverStore';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
  const [serverName, setServerName] = useState('');
  const addServer = useServerStore(state => state.addServer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    
    addServer({
      id: Date.now().toString(),
      name: serverName.trim(),
    });
    setServerName('');
    onClose();
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
            className="relative w-full max-w-md bg-[var(--bg-primary)] rounded-[20px] shadow-2xl overflow-hidden border border-[var(--glass-border)]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-center w-full">Создайте свой сервер</h2>
                <button onClick={onClose} className="absolute right-4 top-4 text-[var(--text-secondary)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-[var(--text-secondary)] text-center text-sm mb-6">
                Сервер — это место, где вы и ваши друзья можете общаться. Создайте свой сервер и начните общаться.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                    Название сервера
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={e => setServerName(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] text-white p-3 rounded-md border border-transparent focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="Сервер пользователя"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-between items-center bg-[var(--bg-secondary)] -mx-6 -mb-6 p-4 px-6">
                  <button type="button" onClick={onClose} className="text-sm text-white hover:underline">
                    Назад
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-6 py-2 rounded-md font-medium transition-colors"
                    disabled={!serverName.trim()}
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
