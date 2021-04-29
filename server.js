const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const api = require('./api/routes')

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage('System', 'Welcome to CUM ZONE'));

        //Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage('System', `A user ${user.username} has jounded the chat`)
            );

        // Send Users & room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chatMessage
    socket.on('chatMessage', msg => {
        //TODO: TypeError: Cannot read property 'room' of undefined
        const user = getCurrentUser(socket.id);
        if (user !== undefined) io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
            io.to(user.room).emit('message', formatMessage('System', `A ${user.username} has left the chat`));
        }
    });
});

// const PORT = process.env.WEB_PORT; //8080
const PORT = 8080; //8080

app.use('/api', api);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});