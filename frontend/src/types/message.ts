export interface Message {
  id: string;
  content?: string;
  type: "text" | "image" | "file";
  senderId: string;
  senderName: string;
  avatarUrl?: string;
  mediaUrl?: string;
  timestamp: string;
  isEncrypted: boolean;
  publicKey?: string;
  encryptedMedia?: {
    data: string;
    mimeType: string;
  };
  status: "sending" | "sent" | "delivered" | "read" | "error";
  error?: string;
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}
