import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import type { WebSocketMessage } from "@/types/websocket";

const wss = new WebSocketServer({ port: 8080 });

// クライアント接続を管理
const clients = new Map<string, WebSocket>();

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const userId = req.url?.split("/").pop();
  if (!userId) {
    ws.close();
    return;
  }

  // クライアントを保存
  clients.set(userId, ws);

  // オンライン状態を他のクライアントに通知
  broadcastStatus(userId, "online");

  ws.on("message", (data: string) => {
    const message: WebSocketMessage = JSON.parse(data);

    switch (message.type) {
      case "message":
        // メッセージを他のクライアントに転送
        broadcastMessage(userId, message);
        break;
      case "typing":
        // タイピング状態を通知
        broadcastTyping(userId, message.data.isTyping ?? false);
        break;
    }
  });

  ws.on("close", () => {
    clients.delete(userId);
    broadcastStatus(userId, "offline");
  });
});

// メッセージをブロードキャスト
function broadcastMessage(senderId: string, message: WebSocketMessage) {
  clients.forEach((client, userId) => {
    if (userId !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// オンライン状態をブロードキャスト
function broadcastStatus(userId: string, status: "online" | "offline") {
  const statusMessage: WebSocketMessage = {
    type: "status",
    data: { userId, status },
  };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(statusMessage));
    }
  });
}

// タイピング状態をブロードキャスト
function broadcastTyping(userId: string, isTyping: boolean) {
  const typingMessage: WebSocketMessage = {
    type: "typing",
    data: { userId, isTyping },
  };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(typingMessage));
    }
  });
}
