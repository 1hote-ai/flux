import { create } from 'zustand';

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar?: string;
  isSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
}

interface VoiceState {
  isConnected: boolean;
  activeChannelId: string | null;
  isMuted: boolean;
  isDeafened: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  participants: VoiceParticipant[];
  
  connect: (channelId: string) => void;
  disconnect: () => void;
  toggleMute: () => void;
  toggleDeafen: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  setSpeaking: (participantId: string, isSpeaking: boolean) => void;
}

// Dummy data for testing UI
const dummyParticipants: VoiceParticipant[] = [
  { id: '1', name: 'User 1', isSpeaking: true, isMuted: false, isDeafened: false },
  { id: '2', name: 'User 2', isSpeaking: false, isMuted: true, isDeafened: false },
  { id: '3', name: 'User 3', isSpeaking: false, isMuted: true, isDeafened: true },
];

export const useVoiceStore = create<VoiceState>((set) => ({
  isConnected: false,
  activeChannelId: null,
  isMuted: false,
  isDeafened: false,
  isVideoEnabled: false,
  isScreenSharing: false,
  participants: [],

  connect: (channelId) => set({
    isConnected: true,
    activeChannelId: channelId,
    participants: dummyParticipants // Populate with dummy on connect
  }),
  
  disconnect: () => set({
    isConnected: false,
    activeChannelId: null,
    participants: []
  }),
  
  toggleMute: () => set((state) => {
    // If deafened and unmuting, undeafen too.
    const isDeafened = state.isDeafened && state.isMuted ? false : state.isDeafened;
    return { isMuted: !state.isMuted, isDeafened };
  }),
  
  toggleDeafen: () => set((state) => {
    const nextDeafened = !state.isDeafened;
    return { 
      isDeafened: nextDeafened,
      // Deafening implies muting
      isMuted: nextDeafened ? true : state.isMuted 
    };
  }),
  
  toggleVideo: () => set((state) => ({ isVideoEnabled: !state.isVideoEnabled })),
  
  toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  
  setSpeaking: (participantId, isSpeaking) => set((state) => ({
    participants: state.participants.map(p => 
      p.id === participantId ? { ...p, isSpeaking } : p
    )
  }))
}));
