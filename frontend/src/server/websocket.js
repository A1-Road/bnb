const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // クライアントを管理

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Received:", data);

      // 初期化メッセージの処理
      if (data.type === "init") {
        clients.set(data.userId, ws);
        console.log(`Client ${data.userId} initialized`);
        ws.send(JSON.stringify({ type: "connected", userId: data.userId }));
        return;
      }

      // 他のメッセージの処理
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });

  ws.on("close", () => {
    // クライアントの切断処理
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log(`Client ${userId} disconnected`);
        break;
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// エラーハンドリング
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});
