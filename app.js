const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userLeave, getCurrentUser, userJoin, getRoomUsers, getUser } = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const botName = 'Admin';

//set a static folder to load by default
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connect
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to Socket Chat!'));

        //Broadcast when a user connect
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`))

        //Send user and room information
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    })

    //when a clients disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

           // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    })

    //Listen for a chat message from the front end
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    //listen for private message and emit to the receiver
    socket.on('privateMessage', (data) => {
        const sender = getCurrentUser(socket.id);
        const user = getUser(data.receiver);

        io.to(user.id).emit('message', formatMessage(sender.username, data.msg));
    })
})

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));