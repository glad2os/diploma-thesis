const {userJoin, getRoomUsers} = require('../utils/users');
const formatMessage = require('../utils/messages');

module.exports = function(io,socket) {
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
};
