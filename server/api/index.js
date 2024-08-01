const path = require("path")
const express = require("express");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

const cors = require("cors");


require("dotenv").config();

const PORT = process.env.PORT || 5000;

const connectDB = require("../config/db");

app.use(cors({
    origin:'https://gossip-a-mern-chat-app.vercel.app'
}));

app.use(express.json());

const userRoute = require("../routes/userRoute");
const chatRoute = require("../routes/chatRoute");
const messageRoute = require("../routes/messageRoute");

app.use("/api/user",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/message",messageRoute);

app.get('/',(req,res)=>{
    res.send("api is working")
})

connectDB();



// ------------------------socket.io for live chatting------------------------------------
const { Server } = require("socket.io");

const io = new Server(httpServer, {
    pingTimeout: 60000, // in milliseconds
    cors: {
        origin: '',
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on("connection", (socket) => {
    console.log("connected to socket.io")

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected')
    })

    socket.on('join_chat', (room) => {
        socket.join(room);
        console.log('room', room)
    })

    socket.on('typing', (room) =>
        socket.in(room).emit("typing")
    )
    socket.on('stop_typing', (room) =>
        socket.in(room).emit("stop_typing")
    )

    socket.on('new_message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users)
            return console.log("chat.users not defined")

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id)
                return;

            socket.in(user._id).emit('message_received', newMessageReceived);

        })
    })

    socket.off('setup', () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})

// ------------------------socket.io for live chatting------------------------------------

httpServer.listen(PORT ,"0.0.0.0", ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})