import { create } from 'zustand';

interface UIState {
  isSettingsOpen: boolean;
  isProfileOpen: boolean;
  isCreateServerOpen: boolean;
  isChannelSidebarOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setCreateServerOpen: (open: boolean) => void;
  setChannelSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  isProfileOpen: false,
  isCreateServerOpen: false,
  isChannelSidebarOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setProfileOpen: (open) => set({ isProfileOpen: open }),
  setCreateServerOpen: (open) => set({ isCreateServerOpen: open }),
  setChannelSidebarOpen: (open) => set({ isChannelSidebarOpen: open }),
}));

export interface User {
  id: string;
  name: string;
  tag: string;
  avatar?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio?: string;
}

interface Server {
  id: string;
  name: string;
  icon?: string;
}

interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: 'text' | 'voice';
}

interface AppDataState {
  currentUser: User;
  servers: Server[];
  channels: Channel[];
  activeServerId: string | null;
  activeChannelId: string | null;
  setActiveServer: (id: string | null) => void;
  setActiveChannel: (id: string | null) => void;
}

// Mock Data
export const mockCurrentUser: User = {
  id: 'u1',
  name: 'Username',
  tag: '#0001',
  status: 'online',
  bio: 'Люблю технологии и хорошее общение.',
};

export const mockServers: Server[] = [
  { id: 's1', name: 'My Server', icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=MyServer' },
  { id: 's2', name: 'Design Team', icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=Design' },
];

export const mockChannels: Channel[] = [
  { id: 'c1', serverId: 's1', name: 'общий', type: 'text' },
  { id: 'c2', serverId: 's1', name: 'команды', type: 'text' },
  { id: 'c3', serverId: 's1', name: 'идеи', type: 'text' },
  { id: 'c4', serverId: 's1', name: 'Общий', type: 'voice' },
  { id: 'c5', serverId: 's1', name: 'Музыка', type: 'voice' },
];

export const useDataStore = create<AppDataState>((set) => ({
  currentUser: mockCurrentUser,
  servers: mockServers,
  channels: mockChannels,
  activeServerId: 's1',
  activeChannelId: 'c1',
  setActiveServer: (id) => set({ activeServerId: id, activeChannelId: null }), // reset channel on server change
  setActiveChannel: (id) => set({ activeChannelId: id }),
}));
