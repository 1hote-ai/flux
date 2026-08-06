import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Volume2, X } from 'lucide-react';
import { useState } from 'react';
import { useChannelStore } from '../../channels/store/channelStore';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId?: string;
}

export function CreateChannelModal({ isOpen, onClose, serverId }: CreateChannelModalProps) {
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [channelName, setChannelName] = useState('');
  const { addChannel, categories } = useChannelStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() || !serverId) return;
    
    // Берем первую категорию сервера для простоты
    const serverCategories = categories.filter(c => c.serverId === serverId);
    const defaultCategoryId = serverCategories.length > 0 ? serverCategories[0].id : 'c1';

    addChannel({
      id: Date.now().toString(),
      serverId: serverId,
      categoryId: defaultCategoryId,
      name: channelName.trim().toLowerCase().replace(/\s+/g, '-'),
      type: channelType,
    });
    
    setChannelName('');
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
            className="relative w-full max-w-[440px] bg-[var(--bg-primary)] rounded-[20px] shadow-2xl overflow-hidden border border-[var(--glass-border)]"
          >
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Создать канал</h2>
                <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6 space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                    Тип канала
                  </label>
                  
                  <div 
                    onClick={() => setChannelType('text')}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${channelType === 'text' ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[var(--bg-tertiary)] hover:bg-[rgba(255,255,255,0.05)]'}`}
                  >
                    <Hash size={24} className="text-[var(--text-secondary)]" />
                    <div>
                      <div className="font-medium text-white">Text</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">Отправляйте сообщения, изображения, GIF-ки, стикеры, мнения и каламбуры</div>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center border-[var(--text-secondary)]">
                      {channelType === 'text' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div 
                    onClick={() => setChannelType('voice')}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${channelType === 'voice' ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[var(--bg-tertiary)] hover:bg-[rgba(255,255,255,0.05)]'}`}
                  >
                    <Volume2 size={24} className="text-[var(--text-secondary)]" />
                    <div>
                      <div className="font-medium text-white">Voice</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">Собирайтесь вместе, используя голосовую связь, видео и демонстрацию экрана</div>
                    </div>
                    <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center border-[var(--text-secondary)]">
                      {channelType === 'voice' && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                    Название канала
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                      {channelType === 'text' ? <Hash size={18} /> : <Volume2 size={18} />}
                    </span>
                    <input
                      type="text"
                      value={channelName}
                      onChange={e => setChannelName(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] text-white p-2.5 pl-10 rounded-md border border-transparent focus:border-[var(--accent-primary)] transition-colors outline-none"
                      placeholder="новые-канал"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="flex justify-end items-center bg-[var(--bg-secondary)] -mx-6 -mb-4 p-4 px-6 gap-4">
                  <button type="button" onClick={onClose} className="text-sm font-medium text-white hover:underline">
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white px-5 py-2 rounded-md font-medium transition-colors"
                    disabled={!channelName.trim()}
                  >
                    Создать канал
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
