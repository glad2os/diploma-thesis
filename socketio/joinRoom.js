const {userJoin, getRoomUsers, isUserOnline, getUniqRoomUsers, getCurrentUser} = require('../utils/users');
const {getMessages, getLastMessages, getServerIdByName} = require('../sql/server');

const formatMessage = require('../utils/messages');

//TODO: аутентификация

module.exports = function (io, socket) {
    socket.on('joinRoom', async ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        if (!isUserOnline(username)) {
            //Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit('message', formatMessage('System', `A user ${user.username} has jounded the chat`));
        }
        // Send Users & room info
        socket.emit('roomUsers', {
            room: room,
            users: getUniqRoomUsers(room)
        });
        socket.emit('messages', await getLastMessages(await getServerIdByName(room)));
        //TODO: отправка последних сообщений (50) в комнате.
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

