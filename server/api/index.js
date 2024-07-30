const path = require("path")
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const connectDB = require("../config/db");

app.use(cors());

app.use(express.json());

const userRoute = require("../routes/userRoute");
const chatRoute = require("../routes/chatRoute");
const messageRoute = require("../routes/messageRoute");
const { socketConnect } = require("../config/webSocketConnect");

app.use("/api/user",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/message",messageRoute);

app.get('/',(req,res)=>{
    res.send("api is working")
})

connectDB();

const server = app.listen(PORT ,"0.0.0.0", ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})

// ------------------------socket.io for live chatting------------------------------------

const io = require('socket.io')(server, {
    pingTimeout: 60000, // in milliseconds
    cors: {
        origin: 'https://gossip-a-mern-chat-app.vercel.app',
    }
});
io.on("connection", socketConnect)

// ------------------------socket.io for live chatting------------------------------------