import { create } from 'zustand';
import type { User, Server, Channel } from '../types';

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

interface AppDataState {
  currentUser: User | null;
  servers: Server[];
  channels: Channel[];
  activeServerId: string | null;
  activeChannelId: string | null;
  setCurrentUser: (user: User | null) => void;
  setActiveServer: (id: string | null) => void;
  setActiveChannel: (id: string | null) => void;
}

export const useDataStore = create<AppDataState>((set) => ({
  currentUser: null,
  servers: [],
  channels: [],
  activeServerId: null,
  activeChannelId: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setActiveServer: (id) => set({ activeServerId: id, activeChannelId: null }),
  setActiveChannel: (id) => set({ activeChannelId: id }),
}));
