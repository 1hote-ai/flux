import { create } from 'zustand';

interface UIStore {
  createServerModalOpen: boolean;
  createChannelModalOpen: boolean;
  inviteModalOpen: boolean;
  
  setCreateServerModalOpen: (isOpen: boolean) => void;
  setCreateChannelModalOpen: (isOpen: boolean) => void;
  setInviteModalOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  createServerModalOpen: false,
  createChannelModalOpen: false,
  inviteModalOpen: false,
  
  setCreateServerModalOpen: (isOpen) => set({ createServerModalOpen: isOpen }),
  setCreateChannelModalOpen: (isOpen) => set({ createChannelModalOpen: isOpen }),
  setInviteModalOpen: (isOpen) => set({ inviteModalOpen: isOpen }),
}));
