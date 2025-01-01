import { useState } from "react";
import type { WebSocketMessage } from "@/types/websocket";

interface OnlineStatus {
  [key: string]: {
    isOnline: boolean;
    lastSeen: string;
  };
}

export const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});

  const updateStatus = (message: WebSocketMessage) => {
    if (
      message.type === "status" &&
      message.data.userId &&
      message.data.status
    ) {
      setOnlineStatus((prev) => ({
        ...prev,
        [message.data.userId as string]: {
          isOnline: message.data.status === "online",
          lastSeen: new Date().toISOString(),
        },
      }));
    }
  };

  const isUserOnline = (targetUserId: string) => {
    const status = onlineStatus[targetUserId];
    if (!status) return false;

    // 5分以内のアクティビティがあればオンラインとみなす
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return status.isOnline && new Date(status.lastSeen) > fiveMinutesAgo;
  };

  return {
    onlineStatus,
    updateStatus,
    isUserOnline,
  };
};
