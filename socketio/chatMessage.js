const {getCurrentUser} = require('../utils/users');
const {getServerIdByName, getUserIdByUsername, addMessage} = require('../sql/server');
const formatMessage = require('../utils/messages');

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = function (io, socket) {
    socket.on('chatMessage', async msg => {
        const user = getCurrentUser(socket.id);
        if (user !== undefined) {
            msg = escapeHtml(msg);
            io.to(user.room).emit('message', formatMessage(user.username, msg));

            let serverId = await getServerIdByName(user.room);
            let userId = await getUserIdByUsername(user.username);

            if (typeof serverId !== "undefined" && typeof userId !== "undefined") {
                await addMessage(serverId, msg, userId);
            }
        }

    });
}