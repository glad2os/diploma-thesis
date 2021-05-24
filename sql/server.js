const sqlite3 = require('sqlite3').verbose();
const {open} = require('sqlite');

function createDbConnection(filename) {
    return open({
        filename,
        driver: sqlite3.Database
    });
}

async function getUserIdByUsername(username) {
    const db = await createDbConnection('./wtchat.db');

    let sql = "select id from users where username = ?";
    let row = await db.get(sql, username);

    if (typeof row === "undefined") return undefined;

    return row.id;
}


async function getServerIdByName(name) {
    const db = await createDbConnection('./wtchat.db');

    let sql = "select id from servers where name = ?";
    let row = await db.get(sql, name);

    if (typeof row === "undefined") return undefined;

    return row.id;
}

async function addMessage(server_id, message, user_id) {
    const db = await createDbConnection('./wtchat.db');

    let sql = `insert into servers_messages (server_id, message, user_id) values(?,?,?)`;
    await db.run(sql, server_id, message, user_id);
}


async function getMessages(server_id, offset, limit) {

    const db = await createDbConnection('./wtchat.db');

    let sql = "select sm.id, sm.message, sm.time, u.username from servers_messages sm inner join users u on u.id = sm.user_id where server_id = ? ORDER BY sm.id limit ?, ?;";
    return await db.all(sql, server_id, offset, limit);
}


async function getLastMessages(server_id) {

    const db = await createDbConnection('./wtchat.db');

    let sql = "select sm.id, sm.message, sm.time, u.username from servers_messages sm inner join users u on u.id = sm.user_id where sm.server_id = ? ORDER BY sm.id limit (select count(*)-50 from servers_messages sm1 where sm1.server_id = ?), 50;";
    let rows = await db.all(sql, server_id, server_id);

    if (typeof rows === "undefined") return undefined;

    return rows;
}

module.exports = {
    getServerIdByName,
    getUserIdByUsername,
    addMessage,
    getMessages,
    getLastMessages
}