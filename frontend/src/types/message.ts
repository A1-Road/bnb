export type MessageType = "text" | "image" | "video" | "file";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  platform: "LINE" | "Telegram";
  userId: string;
  type: MessageType;
  mediaUrl?: string;
  thumbnailUrl?: string;
}
