const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');

const api = require('./api/routes')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    //JoinRoom listener
    require('./socketio/joinRoom')(io, socket);

    //Listen for chatMessage
    require('./socketio/chatMessage')(io, socket);

    //Disconnect Event
    require('./socketio/disconnect')(io, socket);
});

const PORT = () => {
    if (process.env.WEB_PORT === undefined) return 8080;
    else return process.env.WEB_PORT;
}

app.use('/api', api);

server.listen(PORT(), () => {
    console.log(`Server running on port ${PORT()}`)
});