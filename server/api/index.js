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
const { socketConnect } = require("../config/webSocketConnect");

const io = new Server(httpServer, {
    pingTimeout: 60000, // in milliseconds
    cors: {
        origin: 'https://gossip-a-mern-chat-app.vercel.app',
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on("connection", socketConnect)

// ------------------------socket.io for live chatting------------------------------------

httpServer.listen(PORT ,"0.0.0.0", ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})