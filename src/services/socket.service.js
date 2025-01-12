class SocketServices {
  connection(socket) {
    console.log('socket: ', socket.id)
    socket.on("disconnect", () => {
      console.log(`User disconnect id is ${socket.id}`)
    })

    // socket.on('joinRoom', newUserList => {
    //   socket.broadcast.emit("userJoined", "Room has a new person joined");
    // })

    // socket.on("joinRoom", async ({ matchId, partnerId }, listUserMatch) => {
    //   try {
    //     const roomName = `match_${matchId}`;
    //     socket.join(roomName);

    //     // const clients = await io.in(roomName).fetchSockets();
    //     // console.log('clients: ', clients)
    //     // const usersInRoom = await Promise.all(
    //     //   clients.map(async (client) => {
    //     //     console.log('client:', client)
    //     //     if (!partnerId) return null;

    //     //     const club = await Club.findOne({ where: { createdBy: partnerId } });
    //     //     return club || null;
    //     //   })
    //     // );

    //     // Phát broadcast đến các thành viên trong room
    //     _io.broadcast.emit("userJoined", "Room has a new person joined");
    //     // io.to(roomName).emit("userJoined", {
    //     //   matchId,
    //     //   users: usersInRoom,
    //     // });

    //     // console.log("usersInRoom: ", usersInRoom);

    //     console.log(`User ${socket.id} joined room ${roomName}`);
    //   } catch (error) {
    //     console.error(error);
    //     socket.emit("error", "Failed to join room.");
    //   }
    // });

    socket.on("joinRoomSuccess", (listUserMatch) => {
      console.log('listUserMatch: ', listUserMatch)
    })
  }
}

module.exports = new SocketServices();