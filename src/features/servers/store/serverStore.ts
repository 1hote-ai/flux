import { create } from 'zustand';

export interface Server {
  id: string;
  name: string;
  icon?: string;
  hasUnread?: boolean;
  mentions?: number;
}

interface ServerStore {
  activeServerId: string | null;
  servers: Server[];
  collapsedCategories: Record<string, string[]>; // serverId -> array of categoryIds
  setActiveServer: (id: string | null) => void;
  addServer: (server: Server) => void;
  toggleCategory: (serverId: string, categoryId: string) => void;
}

// Моковые данные для начала
const MOCK_SERVERS: Server[] = [
  { id: '1', name: 'Design Team', hasUnread: true },
  { id: '2', name: 'Engineering', mentions: 3, icon: 'https://ui-avatars.com/api/?name=EN&background=4F46E5&color=fff' },
  { id: '3', name: 'Gaming Lounge' },
];

export const useServerStore = create<ServerStore>((set) => ({
  activeServerId: MOCK_SERVERS[0].id,
  servers: MOCK_SERVERS,
  collapsedCategories: {},
  setActiveServer: (id) => set({ activeServerId: id }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] })),
  toggleCategory: (serverId, categoryId) =>
    set((state) => {
      const serverCategories = state.collapsedCategories[serverId] || [];
      const isCollapsed = serverCategories.includes(categoryId);
      
      return {
        collapsedCategories: {
          ...state.collapsedCategories,
          [serverId]: isCollapsed
            ? serverCategories.filter((id) => id !== categoryId)
            : [...serverCategories, categoryId],
        },
      };
    }),
}));
