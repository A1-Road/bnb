import { useEffect, useRef, useState } from "react";
import WebApp from "@twa-dev/sdk";

type WebSocketMessage = {
  type: "message" | "status" | "typing";
  data: {
    userId?: string;
    message?: string;
    status?: "online" | "offline";
    isTyping?: boolean;
  };
};

export const useWebSocket = (userId: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(`wss://your-api-url/ws/${userId}`);

      ws.current.onopen = () => {
        setIsConnected(true);
        WebApp.showAlert("Connected to chat server");
      };

      ws.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);

        // Handle different message types
        switch (message.type) {
          case "message":
            WebApp.showAlert("New message received");
            break;
          case "status":
            // Update online status
            break;
          case "typing":
            // Show typing indicator
            break;
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();
    return () => ws.current?.close();
  }, [userId]);

  const sendMessage = (
    type: WebSocketMessage["type"],
    data: WebSocketMessage["data"]
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }));
    }
  };

  return { isConnected, lastMessage, sendMessage };
};
