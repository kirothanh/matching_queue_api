const { Club } = require("../models/index");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", async ({ matchId, partnerId }) => {
      try {
        const roomName = `match_${matchId}`;
        socket.join(roomName);

        // // Phát broadcast đến các thành viên trong room
        // socket.broadcast.emit("userJoined", "Room has a new person joined");

        console.log(`User ${socket.id} joined room ${roomName}`);
      } catch (error) {
        console.error(error);
        socket.emit("error", "Failed to join room.");
      }
    });

    socket.on("userJoined", async ({ matchId, users }) => {
      try {
        const roomName = `match_${matchId}`;
        io.to(roomName).emit("userJoined", { message, matchId, users });
      } catch (error) {
        console.error("Error broadcasting userJoined:", error);
        socket.emit("error", "Failed to broadcast userJoined.");
      }
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
