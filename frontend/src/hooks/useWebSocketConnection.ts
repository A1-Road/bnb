import { useEffect, useRef, useCallback } from "react";
import type { WebSocketMessage } from "@/types/websocket";

const RECONNECT_INTERVAL = 3000; // 3秒後に再接続
const MAX_RECONNECT_ATTEMPTS = 5;

export const useWebSocketConnection = (
  onMessage: (message: WebSocketMessage) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (isConnectingRef.current) return;

    try {
      isConnectingRef.current = true;
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080";
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = () => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.log("WebSocket connection attempt failed, retrying...");
        }
        ws.close();
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        isConnectingRef.current = false;
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error);
      isConnectingRef.current = false;
    }
  }, [onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      isConnectingRef.current = false;
    };
  }, [connect]);

  return wsRef;
};
