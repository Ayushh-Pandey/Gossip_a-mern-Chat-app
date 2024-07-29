const socketConnect = (socket) => {
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
    }

module.exports = {socketConnect}
