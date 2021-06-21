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

// const { Server } = require("ws");
// const express = require("express");

// const PORT = process.env.PORT || 1000;

// const server = express().listen(PORT, () =>
//   console.log(`Listening on ${PORT}`)
// );
// const wss = new Server({ server });

// wss.on("connection", (ws) => {
//   console.log("Client connected");
//   ws.on("close", () => console.log("Client disconnected"));
//   ws.send("Добро пожаловать в Chat");
// });
