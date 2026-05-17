import { Server } from "socket.io";
import { sendMessage } from "./chatting/chat.services.js";
import socketAuth from "./middleware/authentication.socketio.js";

export const runSocketIO = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(socketAuth); //authentication middleware

  io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("sendMessage", sendMessage(socket, io));
  });
  return io;
};
