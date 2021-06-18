// const WebSocket = require("ws");

// const server = new WebSocket.Server({ port: 1000 });

// server.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     server.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
//   ws.send("Добро пожаловать в Chat");
// });

const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const port = 8080;

const server = http.createServer(app);

app.get("/", function (req, res, next) {
  return res.send("Hello World!");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
  ws.send("something from server");
});

server.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log(`wss`, wss?.port);
  console.log(`listening on port ${port}!`);
});
