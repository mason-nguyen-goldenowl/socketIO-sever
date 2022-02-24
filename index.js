const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
var router = express.Router();
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());

const sever = http.createServer(app);

const io = new Server(sever, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const socketRoute = router.get("/", function (req, res) {
  io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected", socket.id);
    });
  });
});
app.use("/", socketRoute);

const port = process.env.PORT || 3838;

sever.listen(port, () => {
  console.log("SERVER RUNNING...");
});
