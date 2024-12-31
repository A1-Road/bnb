import { useState, useEffect, useCallback, useRef } from "react";
import type { WebSocketMessage } from "@/types/websocket";

const RECONNECT_INTERVAL = 3000; // 3秒後に再接続
const MAX_RECONNECT_ATTEMPTS = 5;

export const useWebSocket = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL ?? "");
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        ws.send(JSON.stringify({ type: "init", userId }));
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, RECONNECT_INTERVAL);
      }
    }
  }, [userId]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (type: WebSocketMessage["type"], data: WebSocketMessage["data"]) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, data }));
      } else {
        console.warn("WebSocket is not connected. Message not sent:", {
          type,
          data,
        });
      }
    },
    []
  );

  return {
    isConnected,
    lastMessage,
    sendMessage,
    reconnect: connect,
    reconnectAttempts: reconnectAttemptsRef.current,
  };
};
