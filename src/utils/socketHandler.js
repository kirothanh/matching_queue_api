const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("matchCreated", (newMatch) => {
      io.emit("matchCreated", newMatch);
    });

    socket.on("joinRoom", async ({ matchId }) => {
      try {
        const roomName = `match_${matchId}`;
        socket.join(roomName);
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

    socket.on("partnerConfirmed", ({ matchId, partnerId, message }) => {
      const roomName = `match_${matchId}`;
      io.to(roomName).emit("partnerConfirmed", { matchId, partnerId, message });
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
