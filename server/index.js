const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log(socket.id);
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    users[socket.id] = msg.user;
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`${users[socket.id]} disconnected`);
    io.emit("chat message", {
      user: `${users[socket.id]}`,
      msg: "left the chat",
    });
  });
});

server.listen(3000, () => {
  console.log(`Socket.IO server running at http://localhost:3000/`);
});
