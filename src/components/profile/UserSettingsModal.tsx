import React, { useState } from 'react';
import { BaseModal } from '../modals/BaseModal';
import { useModalStore } from '../../store/modalStore';
import { useThemeStore } from '../../store/themeStore';
import { useUserStore } from '../../store/userStore';
import { Tabs } from '../ui/Tabs';
import { Switch } from '../ui/Switch';
import { Input } from '../ui/Input';
import { Palette, Bell, Volume2, Moon, Sun, Monitor } from 'lucide-react';
import classNames from 'classnames';

export const UserSettingsModal: React.FC = () => {
  const { closeModal } = useModalStore();
  const [activeTab, setActiveTab] = useState('theme');
  
  const tabs = [
    { id: 'theme', label: 'Внешний вид', icon: <Palette size={16} /> },
    { id: 'notifications', label: 'Уведомления', icon: <Bell size={16} /> },
    { id: 'sound', label: 'Звук', icon: <Volume2 size={16} /> },
  ];

  return (
    <BaseModal onClose={closeModal} className="max-w-2xl h-[600px] flex overflow-hidden p-0">
      <div className="w-1/3 bg-[var(--bg-tertiary)] border-r border-[var(--divider)] p-4 flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3">
            Настройки пользователя
          </h3>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} orientation="vertical" />
        </div>
      </div>
      
      <div className="w-2/3 bg-[var(--bg-secondary)] p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">{tabs.find(t => t.id === activeTab)?.label}</h2>
        
        {activeTab === 'theme' && <ThemeTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'sound' && <SoundTab />}
      </div>
    </BaseModal>
  );
};

const ThemeTab = () => {
  const { theme, accentColor, glowIntensity, glassBlur, setTheme, setAccentColor, setGlowIntensity, setGlassBlur } = useThemeStore();

  const colors = [
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Purple', value: '#A855F7' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Theme selection */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Тема</label>
        <div className="grid grid-cols-3 gap-3">
          <ThemeOption 
            icon={<Moon />} 
            label="Тёмная" 
            active={theme === 'dark'} 
            onClick={() => setTheme('dark')} 
          />
          <ThemeOption 
            icon={<Sun />} 
            label="Светлая" 
            active={theme === 'light'} 
            onClick={() => setTheme('light')} 
          />
        </div>
      </div>

      {/* Accent Color */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Цвет акцента</label>
        <div className="flex gap-3 flex-wrap">
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => setAccentColor(c.value)}
              className={classNames(
                'w-8 h-8 rounded-full transition-all outline-none',
                accentColor === c.value ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-secondary)] ring-[var(--text-primary)] scale-110' : 'hover:scale-110'
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Effects */}
      <div className="flex flex-col gap-6">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Эффекты интерфейса</label>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Интенсивность свечения (Glow)</span>
            <span className="text-[var(--text-muted)]">{Math.round(glowIntensity * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.1" 
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-primary)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Размытие стекла (Blur)</span>
            <span className="text-[var(--text-muted)]">{glassBlur}px</span>
          </div>
          <input 
            type="range" 
            min="0" max="24" step="1" 
            value={glassBlur}
            onChange={(e) => setGlassBlur(parseFloat(e.target.value))}
            className="w-full accent-[var(--accent-primary)]"
          />
        </div>
      </div>
    </div>
  );
};

const ThemeOption = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={classNames(
      'flex flex-col items-center gap-2 p-4 rounded-[var(--radius-md)] border transition-all outline-none',
      active 
        ? 'bg-[var(--bg-tertiary)] border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]' 
        : 'bg-[var(--bg-base)] border-[var(--divider)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
    )}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const NotificationsTab = () => {
  const { notificationsEnabled, setNotifications } = useUserStore();
  
  return (
    <div className="flex flex-col gap-4">
      <Switch 
        checked={notificationsEnabled} 
        onChange={setNotifications} 
        label="Разрешить уведомления" 
        description="Получать push-уведомления на рабочем столе" 
      />
      <div className="h-px bg-[var(--divider)] my-2" />
      <Switch 
        checked={true} 
        onChange={() => {}} 
        label="Звук уведомлений" 
        description="Воспроизводить звук при получении сообщения" 
      />
      <Switch 
        checked={true} 
        onChange={() => {}} 
        label="Уведомлять только при упоминании" 
        description="Получать уведомления только если вас упомянули (@username)" 
      />
    </div>
  );
};

const SoundTab = () => {
  const { soundEnabled, setSound } = useUserStore();
  
  return (
    <div className="flex flex-col gap-4">
      <Switch 
        checked={soundEnabled} 
        onChange={setSound} 
        label="Звуки интерфейса" 
        description="Воспроизводить звуки при наведении, кликах и открытии модалок" 
      />
      <div className="h-px bg-[var(--divider)] my-2" />
      
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Громкость</label>
        <div className="flex items-center gap-4">
          <Volume2 size={20} className="text-[var(--text-secondary)]" />
          <input type="range" min="0" max="100" defaultValue="50" className="flex-1 accent-[var(--accent-primary)]" />
        </div>
      </div>
    </div>
  );
};
