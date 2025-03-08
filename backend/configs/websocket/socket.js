import { Server } from "socket.io";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
    pingTimeout: 60000,
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Authentication error"));
    }
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected ${socket.userId}`);

    socket.join(socket.userId);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      socket.leave(socket.userId);
    });
  });

  return io;
};

export default initializeSocket;
