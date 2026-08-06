import { create } from 'zustand';

export interface ChannelCategory {
  id: string;
  serverId: string;
  name: string;
}

export interface Channel {
  id: string;
  serverId: string;
  categoryId: string;
  name: string;
  type: 'text' | 'voice';
}

interface ChannelStore {
  activeChannelId: string | null;
  activeVoiceChannelId: string | null;
  channels: Channel[];
  categories: ChannelCategory[];
  
  setActiveChannel: (id: string | null) => void;
  setActiveVoiceChannel: (id: string | null) => void;
  addChannel: (channel: Channel) => void;
  addCategory: (category: ChannelCategory) => void;
}

// Моковые данные
const MOCK_CATEGORIES: ChannelCategory[] = [
  { id: 'c1', serverId: '1', name: 'Information' },
  { id: 'c2', serverId: '1', name: 'Text Channels' },
  { id: 'c3', serverId: '1', name: 'Voice Channels' },
];

const MOCK_CHANNELS: Channel[] = [
  { id: 'ch1', serverId: '1', categoryId: 'c1', name: 'announcements', type: 'text' },
  { id: 'ch2', serverId: '1', categoryId: 'c1', name: 'rules', type: 'text' },
  { id: 'ch3', serverId: '1', categoryId: 'c2', name: 'general', type: 'text' },
  { id: 'ch4', serverId: '1', categoryId: 'c2', name: 'design-talk', type: 'text' },
  { id: 'ch5', serverId: '1', categoryId: 'c3', name: 'General Voice', type: 'voice' },
  { id: 'ch6', serverId: '1', categoryId: 'c3', name: 'Design Sync', type: 'voice' },
];

export const useChannelStore = create<ChannelStore>((set) => ({
  activeChannelId: MOCK_CHANNELS[0].id,
  activeVoiceChannelId: null,
  channels: MOCK_CHANNELS,
  categories: MOCK_CATEGORIES,
  
  setActiveChannel: (id) => set({ activeChannelId: id }),
  setActiveVoiceChannel: (id) => set({ activeVoiceChannelId: id }),
  addChannel: (channel) => set((state) => ({ channels: [...state.channels, channel] })),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
}));
