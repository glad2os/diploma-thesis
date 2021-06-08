const path = require("path");
const http = require("http");
let express = require('express');
const socketio = require('socket.io');

const api = require('./api/routes')
const view = require('./viewPages')

let app = express();

app.set('view engine', 'ejs');

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

    //Send file Event
    require('./socketio/files')(io, socket);
});

const PORT = typeof process.env.WEB_PORT === 'undefined' ? 8080 : process.env.WEB_PORT;

app.use(api.getSession());
app.use('/api', api.app);
app.use('/', view);

const isDocker = require('is-docker');

if (isDocker()) {
    console.log('Running inside a Docker container');
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});