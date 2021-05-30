const express = require('express');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./wtchat.db');
let app = express.Router();

const users = require('./users/users');
const servers = require('./servers/servers');
const uploadfile = require('./file-upload/upload-file');

servers.setDb(db);
users.setDb(db);

app.use(express.json());

app.use("/user", users.app);
app.use("/servers", servers.app);
app.use("/uploadfile", uploadfile.app);

function getSession() {
    return users.getSession();
}

app.get('/', function (req, res) {
    res.json({
        'author': "glad2os",
        'version': "v.228"
    });
});


module.exports = {app, getSession}