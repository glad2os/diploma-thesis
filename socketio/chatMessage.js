const {getCurrentUser} = require('../utils/users');
const formatMessage = require('../utils/messages');

module.exports = function (io, socket) {
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        if (user !== undefined) io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
}