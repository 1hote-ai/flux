import { create } from 'zustand';

export type ModalType = 
  | 'CREATE_SERVER'
  | 'CREATE_CHANNEL'
  | 'INVITE_USER'
  | 'CONFIRM_ACTION'
  | 'USER_PROFILE'
  | 'USER_SETTINGS';

interface ModalData {
  serverId?: string;
  channelId?: string;
  userId?: string;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  [key: string]: any;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  openModal: (type, data = {}) => set({ type, data, isOpen: true }),
  closeModal: () => set({ type: null, data: {}, isOpen: false }),
}));
