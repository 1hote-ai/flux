import { create } from 'zustand';

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
}

export interface Dialog {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatState {
  messages: Record<string, Message[]>; // channelId or dialogId -> Message[]
  dialogs: Dialog[];
  activeDialogId: string | null;
  isLoadingHistory: Record<string, boolean>; // channelId -> loading state

  sendMessage: (channelId: string, authorId: string, authorName: string, authorAvatar: string | undefined, content: string) => void;
  deleteMessage: (messageId: string, channelId: string) => void;
  setActiveDialog: (dialogId: string | null) => void;
  markAsRead: (dialogId: string) => void;
  loadHistory: (channelId: string) => Promise<void>;
}

// Mock initial data
const mockDialogs: Dialog[] = [
  {
    id: 'd1',
    name: 'Alex Developer',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Alex',
    status: 'online',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'd2',
    name: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Designer',
    status: 'idle',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unreadCount: 0,
  }
];

const mockMessages: Record<string, Message[]> = {
  'd1': [
    {
      id: 'm1',
      channelId: 'd1',
      authorId: 'u2',
      authorName: 'Alex Developer',
      authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Alex',
      content: 'Привет! Как продвигается дизайн чата?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'm2',
      channelId: 'd1',
      authorId: 'u1',
      authorName: 'Username',
      authorAvatar: undefined,
      content: 'Привет! Работаю над списком сообщений и анимациями.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    }
  ],
  'c1': [
    {
      id: 'm3',
      channelId: 'c1',
      authorId: 'u2',
      authorName: 'Alex Developer',
      authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Alex',
      content: 'Добро пожаловать в общий канал!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ]
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockMessages,
  dialogs: mockDialogs,
  activeDialogId: null,
  isLoadingHistory: {},

  sendMessage: (channelId, authorId, authorName, authorAvatar, content) => {
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      channelId,
      authorId,
      authorName,
      authorAvatar,
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), newMessage]
      }
    }));
  },

  deleteMessage: (messageId, channelId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId]?.filter(m => m.id !== messageId) || []
      }
    }));
  },

  setActiveDialog: (dialogId) => {
    set({ activeDialogId: dialogId });
    if (dialogId) {
      get().markAsRead(dialogId);
    }
  },

  markAsRead: (dialogId) => {
    set((state) => ({
      dialogs: state.dialogs.map(d => 
        d.id === dialogId ? { ...d, unreadCount: 0 } : d
      )
    }));
  },

  loadHistory: async (channelId) => {
    // Prevent multiple loads
    if (get().isLoadingHistory[channelId]) return;

    set((state) => ({
      isLoadingHistory: { ...state.isLoadingHistory, [channelId]: true }
    }));

    // Fake delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Fake history data
    const historyMessages: Message[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `h_${Date.now()}_${i}`,
      channelId,
      authorId: 'system',
      authorName: 'System',
      content: `Старое сообщение ${i + 1} из истории...`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)).toISOString(),
    }));

    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...historyMessages.reverse(), ...(state.messages[channelId] || [])]
      },
      isLoadingHistory: { ...state.isLoadingHistory, [channelId]: false }
    }));
  }
}));
