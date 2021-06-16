const {userJoin, getRoomUsers, isUserOnline, getUniqRoomUsers, getCurrentUser} = require('../utils/users');
const {getMessages, getLastMessages, getServerIdByName} = require('../sql/server');

const formatMessage = require('../utils/messages');

//TODO: аутентификация

module.exports = function (io, socket) {
    socket.on('joinRoom', async ({username, room}) => {

        if (!isUserOnline(username)) {
            socket.broadcast
                .to(room)
                .emit('message', formatMessage('System', `A user ${username} has jounded the chat`));
        }

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Send Users & room info
        io.to(room).emit('roomUsers', {
            room: room,
            users: getUniqRoomUsers(room)
        });
        socket.emit('messages', await getLastMessages(await getServerIdByName(room)));
    });

    socket.on('getOldMessages', async firstId => {
        const user = getCurrentUser(socket.id);
        let offset = firstId - 50 - 1;
        let limit = 50;
        if (offset < 0) {
            limit += offset;
            offset = 0;
        }
        if (limit > 0)
            socket.emit('messages', await getMessages(await getServerIdByName(user.room), offset, limit));
    });
};