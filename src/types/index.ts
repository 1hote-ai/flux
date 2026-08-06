export interface User {
  id: string;
  name: string;
  username: string;
  tag: string;
  email: string;
  avatar?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio?: string;
}

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

export interface Server {
  id: string;
  name: string;
  icon?: string;
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: 'text' | 'voice';
}
