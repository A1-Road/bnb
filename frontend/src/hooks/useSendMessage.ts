import { useState } from "react";
import type { Message } from "@/types/message";
import type { KeyPair } from "@/utils/encryption";

interface SendMessageOptions {
  encrypt?: boolean;
  keyPair?: KeyPair;
  recipientPublicKey?: string;
}

const getMessageType = (file?: File) => {
  if (!file) return "text";
  return file.type.startsWith("image/") ? "image" : "file";
};

export const useSendMessage = () => {
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    content: string,
    file?: File,
    options?: SendMessageOptions
  ) => {
    setIsLoading(true);
    setError(null);
    const tempId = `temp-${Date.now()}`;
    const messageType = getMessageType(file);

    const newMessage: Message = {
      id: tempId,
      content,
      type: messageType,
      senderId: "user1", // 現在のユーザーID
      senderName: "Current User",
      timestamp: new Date().toISOString(),
      isEncrypted: !!options?.encrypt,
      status: "sending" as const,
    };

    setPendingMessages((prev) => [...prev, newMessage]);

    try {
      // メッセージ送信処理
      const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ message: newMessage, file }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      return { ...data, status: "sent" };
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    pendingMessages,
    retryMessage: (messageId: string) => {
      const message = pendingMessages.find((msg) => msg.id === messageId);
      if (message) {
        // 再送信処理
        sendMessage(message.content ?? "", undefined, {
          encrypt: message.isEncrypted,
        });
      }
    },
    isLoading,
    error,
  };
};
