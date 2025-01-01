import { useWebSocketConnection } from "./useWebSocketConnection";
import { useWebSocketMessages } from "./useWebSocketMessages";
import { useWebSocketSend } from "./useWebSocketSend";

export const useWebSocket = (userId: string) => {
  const { lastMessage, handleMessage } = useWebSocketMessages();
  const wsRef = useWebSocketConnection(handleMessage);
  const sendMessage = useWebSocketSend(wsRef);

  return {
    lastMessage,
    sendMessage,
  };
};
