const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});

io.on("connection", (socket) => {
    console.log("Usuari connectat:", socket.id);

    socket.on("disconnect", () => {
        console.log("Usuari desconnectat:", socket.id);
    });
});

app.set("io", io);

server.listen(5000, () => {
    console.log("Server running on port 5000");
});