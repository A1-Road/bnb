import { useState, useCallback } from "react";
import type { WebSocketMessage } from "@/types/websocket";

export const useWebSocketMessages = () => {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
  }, []);

  return {
    lastMessage,
    handleMessage,
  };
};
