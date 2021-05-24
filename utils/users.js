const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);

    return user;
}

// get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function isUserOnline(username) {
    return users.find(user => user.username === username) !== undefined;
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function getUniqRoomUsers(room) {
    return users.filter(user => user.room === room).map(user => user.username).filter(onlyUnique);
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    isUserOnline,
    getUniqRoomUsers
};