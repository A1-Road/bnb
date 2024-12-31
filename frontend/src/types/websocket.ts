export type WebSocketMessage = {
  type: "message" | "status" | "typing";
  data: {
    userId?: string;
    message?: string;
    status?: "online" | "offline";
    isTyping?: boolean;
  };
};
