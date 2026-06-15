const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("message", (message) => {
    // Broadcast message to everyone
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
