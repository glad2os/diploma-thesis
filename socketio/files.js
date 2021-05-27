const {getCurrentUser} = require('../utils/users');
const {getServerIdByName, getUserIdByUsername, addMessage} = require('../sql/server');
const formatMessage = require('../utils/messages');
const fs = require('fs');

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = function (io, socket) {
    socket.on('file', async ({filetype, filename}) => {

        const user = getCurrentUser(socket.id);
        if (user !== undefined) {
            let type = filetype.split("/");
            let dir = __dirname + "../../uploads/";
            if (type[0] === "image") {
                const contents = fs.readFileSync(dir + filename, {encoding: 'base64'});
                io.to(user.room).emit('message', formatMessage(user.username, `<img style='width: 55vw;' src="data:${filetype};base64,${contents}"`));
                let serverId = await getServerIdByName(user.room);
                let userId = await getUserIdByUsername(user.username);

                if (typeof serverId !== "undefined" && typeof userId !== "undefined") {
                    await addMessage(serverId, `<img style='width: 55vw;' src="data:${filetype};base64,${contents}"`, userId);
                }
            }
            if (type[0] === "file") {

            }
        }

    });
}