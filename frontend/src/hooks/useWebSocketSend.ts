import { useCallback } from "react";
import type { WebSocketMessage } from "@/types/websocket";

export const useWebSocketSend = (wsRef: React.RefObject<WebSocket | null>) => {
  const sendMessage = useCallback(
    (type: WebSocketMessage["type"], data: WebSocketMessage["data"]) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type, data }));
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [wsRef]
  );

  return sendMessage;
};
