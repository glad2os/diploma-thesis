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

module.exports = {
    getServerIdByName,
    getUserIdByUsername,
    addMessage
}