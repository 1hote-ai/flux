import { create } from 'zustand';

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  status: UserStatus;
  customStatus?: string;
}

interface UserState {
  currentUser: User | null;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  setCurrentUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setNotifications: (enabled: boolean) => void;
  setSound: (enabled: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: 'user_1',
    username: 'FluxUser',
    status: 'online',
    customStatus: 'Exploring Flux',
    avatarUrl: 'https://api.dicebear.com/9.x/glass/svg?seed=FluxUser'
  },
  notificationsEnabled: true,
  soundEnabled: true,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUser: (updates) => set((state) => ({ 
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null 
  })),
  setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
  setSound: (enabled) => set({ soundEnabled: enabled }),
}));
