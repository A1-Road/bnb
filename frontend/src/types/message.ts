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
  encrypted?: boolean;
  publicKey?: string;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}
