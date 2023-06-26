const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server);

try {
  io.on("connection", (socket) => {
    console.log("Connected Socket: ", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });

    socket.on("message", (data) => {
      console.log("The data that's comming from frontend is : \n");
      console.log(data);
      socket.broadcast.emit("message-receive", data);
    });
  });

  const port = 3000; // Change to the desired port number
  server.listen(port, () => {
    console.log(`Socket.io server is running on port ${port}`);
  });
} catch (error) {
  console.error("An error occurred: ", error);
}
