const WebSocket = require("ws");

const server = new WebSocket.Server();

server.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(server.clients);
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.send("Добро пожаловать в Chat");
});
server.listen(PORT, () => console.log("Server started on " + PORT));
