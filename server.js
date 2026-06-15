const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  ws.username = "Anonymous";
  clients.push(ws);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      // Set username
      if (data.type === "login") {
        ws.username = data.username;
        return;
      }

      // Chat message
      if (data.type === "message") {
        const fullMessage = JSON.stringify({
          username: ws.username,
          text: data.text
        });

        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(fullMessage);
          }
        });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  });

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running...");
});
