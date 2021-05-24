const {isUserOnline, userLeave, getUniqRoomUsers} = require('../utils/users');
const formatMessage = require('../utils/messages');

module.exports = function (io, socket) {
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUniqRoomUsers(user.room)
            });
            if (!isUserOnline(user.username))
                io.to(user.room).emit('message', formatMessage('System', `A ${user.username} has left the chat`));
        }
    });
}