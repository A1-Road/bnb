export type WebSocketMessage = {
  type: "message" | "status" | "typing" | "init";
  data: {
    userId?: string;
    message?: string;
    status?: "online" | "offline";
    isTyping?: boolean;
  };
};
