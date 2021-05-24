const {userJoin, getRoomUsers, isUserOnline, getUniqRoomUsers} = require('../utils/users');
const formatMessage = require('../utils/messages');

//TODO: аутентификация

module.exports = function (io, socket) {
    socket.on('joinRoom', ({username, room}) => {

        if (!isUserOnline(username)) {
            const user = userJoin(socket.id, username, room);

            socket.join(user.room);

            socket.emit('message', formatMessage('System', 'Welcome to chat ZONE'));

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
                users: getUniqRoomUsers(user.room)
            });
        } else {
            const user = userJoin(socket.id, username, room);

            socket.join(room);
            socket.emit('message', formatMessage('System', 'Welcome to chat ZONE'));

            socket.emit('roomUsers', {
                room: room,
                users: getUniqRoomUsers(room)
            });
        }
        //TODO: отправка последних сообщений (50) в комнате.
    });
};

