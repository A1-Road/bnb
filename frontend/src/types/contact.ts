export interface Contact {
  id: string;
  name: string;
  platform: "LINE" | "Telegram";
  avatarUrl?: string;
  lastMessage?: string;
  lastActive: string;
}
