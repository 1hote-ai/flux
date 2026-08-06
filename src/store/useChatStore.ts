import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import type { Message, Dialog } from '../types';


interface ChatState {
  messages: Record<string, Message[]>;
  dialogs: Dialog[];
  activeDialogId: string | null;
  isLoadingHistory: Record<string, boolean>;
  socket: Socket | null;
  isConnected: boolean;
  abortControllers: Record<string, AbortController>;

  initSocket: () => void;
  disconnectSocket: () => void;
  sendMessage: (channelId: string, content: string) => void;
  deleteMessage: (messageId: string, channelId: string) => void;
  setActiveDialog: (dialogId: string | null) => void;
  markAsRead: (dialogId: string) => void;
  loadHistory: (channelId: string) => Promise<void>;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  dialogs: [],
  activeDialogId: null,
  isLoadingHistory: {},
  socket: null,
  isConnected: false,

  abortControllers: {},

  initSocket: () => {
    if (get().socket) return;
    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
    if (!isLoggedIn) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    const socket = io(wsUrl, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => set({ isConnected: true }));
    socket.on('disconnect', () => set({ isConnected: false }));

    socket.on('receive_message', (message: Message) => {
      get().addMessage(message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  addMessage: (message: Message) => {
    set((state) => {
      const channelMessages = state.messages[message.channelId] || [];
      if (channelMessages.some(m => m.id === message.id)) return state;
      
      return {
        messages: {
          ...state.messages,
          [message.channelId]: [...channelMessages, message]
        }
      };
    });
  },

  sendMessage: (channelId, content) => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('send_message', { channelId, content });
    }
  },

  joinChannel: (channelId: string) => {
    const { socket } = get();
    if (socket && socket.connected) socket.emit('join_channel', channelId);
  },

  leaveChannel: (channelId: string) => {
    const { socket } = get();
    if (socket && socket.connected) socket.emit('leave_channel', channelId);
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
    if (get().isLoadingHistory[channelId]) return;

    // Abort previous request for this channel if exists
    const prevController = get().abortControllers[channelId];
    if (prevController) {
      prevController.abort();
    }

    const controller = new AbortController();
    
    set((state) => ({
      isLoadingHistory: { ...state.isLoadingHistory, [channelId]: true },
      abortControllers: { ...state.abortControllers, [channelId]: controller }
    }));

    try {
      // Имитация до реализации API эндпоинта
      // const res = await api.get(`/channels/${channelId}/messages`, { signal: controller.signal });
      const historyMessages: Message[] = [];

      set((state) => ({
        messages: {
          ...state.messages,
          [channelId]: [...historyMessages.reverse(), ...(state.messages[channelId] || [])]
        },
        isLoadingHistory: { ...state.isLoadingHistory, [channelId]: false }
      }));
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.message === 'canceled') return; // Ignore aborts
      
      console.error(error);
      set((state) => ({
        isLoadingHistory: { ...state.isLoadingHistory, [channelId]: false }
      }));
    }
  }
}));
