const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 1000 });

server.on("connection", (ws) => {
  ws.on("message", (message) => {
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.send("Добро пожаловать в Chat");
});

console.log("server.options.port", server.options.port);
