export interface Message {
  id: string;
  content: string;
  timestamp: string;
  platform: "LINE" | "Telegram";
  userId: string;
}
