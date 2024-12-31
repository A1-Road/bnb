export interface Contact {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  lastSeen: string;
  lastMessage: string;
  unreadCount: number;
  isOnline: boolean;
  platform: "Telegram" | "LINE";
  lastActive: string;
}
