import { WebSocketServer } from "ws";
import type { WebSocket as WS } from "ws";
import type { WebSocketMessage } from "@/types/websocket";

const wss = new WebSocketServer({ port: 8080 });

interface Client {
  ws: WS;
  userId?: string;
}

const clients = new Map<string, Client>();

wss.on("connection", (ws: WS) => {
  const client: Client = { ws };

  ws.on("message", (data: string) => {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case "status":
          if (message.data.userId) {
            client.userId = message.data.userId;
            clients.set(message.data.userId, client);
            broadcastStatus(message.data.userId, "online");
          }
          break;

        case "message":
          if (message.data.userId && message.data.message) {
            const targetClient = clients.get(message.data.userId);
            if (targetClient) {
              targetClient.ws.send(
                JSON.stringify({
                  type: "message",
                  data: message.data,
                })
              );
            }
          }
          break;

        case "typing":
          if (message.data.userId) {
            const targetClient = clients.get(message.data.userId);
            if (targetClient) {
              targetClient.ws.send(
                JSON.stringify({
                  type: "typing",
                  data: {
                    isTyping: message.data.isTyping,
                  },
                })
              );
            }
          }
          break;
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  ws.on("close", () => {
    if (client.userId) {
      clients.delete(client.userId);
      broadcastStatus(client.userId, "offline");
    }
  });
});

function broadcastStatus(userId: string, status: "online" | "offline") {
  for (const client of clients.values()) {
    if (client.userId !== userId) {
      client.ws.send(
        JSON.stringify({
          type: "status",
          data: {
            userId,
            status,
            timestamp: new Date().toISOString(),
          },
        })
      );
    }
  }
}

console.log("WebSocket server is running on port 8080");
