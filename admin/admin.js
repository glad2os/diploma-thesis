const path = require("path");

const express = require('express');

let app = express.Router();

const ADMIN_PASSWORD = typeof process.env.ADMIN_PASSWORD === 'undefined' ? "test" : process.env.ADMIN_PASSWORD;

app.use(express.static(path.join(__dirname, '../view/admin-view/admin-assets/')));

async function getInfo() {
    const sqlite3 = require('sqlite3').verbose();
    const {open} = require('sqlite');

    function createDbConnection(filename) {
        return open({
            filename,
            driver: sqlite3.Database
        });
    }

    const db = await createDbConnection('./wtchat.db');

    let sql = "select (select count(id) from users) as countUsers,\n" +
        "       (select count(id) from servers) as countServers,\n" +
        "       (select count(id) from servers_messages) as countMessanges";

    let row = await db.get(sql);

    return [row.countUsers, row.countServers, row.countMessanges];
}

app.get('/', async function (req, res) {
    const isDocker = require('is-docker');

    if (req.session.adminPass === ADMIN_PASSWORD) {
        let info = await getInfo();
        res.render("admin-view/index", {
            "username": req.session.username === undefined ? "root" : req.session.username,
            "isDocker": isDocker(),
            "countUsers": info[0],
            "countServers": info[1],
            "countMessanges": info[2]
        });
        res.end();
        return;
    }
    if (typeof req.query.password !== undefined && req.query.password === ADMIN_PASSWORD) {
        req.session.adminPass = ADMIN_PASSWORD;
        let info = await getInfo();
        res.render("admin-view/index", {
            "username": req.session.username === undefined ? "root" : req.session.username,
            "isDocker": isDocker(),
            "countUsers": info[0],
            "countServers": info[1],
            "countMessanges": info[2]
        });
    } else {
        res.render("admin_login");
    }
    res.end();
});

app.get('/reguser', function (req, res) {
    if (req.session.adminPass === ADMIN_PASSWORD) {
        res.render("admin-view/register", {
            "username": req.session.username === undefined ? "root" : req.session.username
        });
        res.end();
        return;
    } else {
        res.send("403 access forbidden");
    }
    res.end();
});

app.get('/edituser', function (req, res) {
    if (typeof req.query.username === "undefined") {
        res.end();
        return;
    }

    if (req.session.adminPass === ADMIN_PASSWORD) {
        res.render("admin-view/edituser", {
            "username": req.query.username
        });
        res.end();
        return;
    } else {
        res.send("403 access forbidden");
    }
    res.end();
});

app.get('/users', function (req, res) {
    if (req.session.adminPass === ADMIN_PASSWORD) {
        res.render("admin-view/users", {
            "username": req.session.username === undefined ? "root" : req.session.username
        });
        res.end();
        return;
    } else {
        res.send("403 access forbidden");
    }
    res.end();
});

app.get('/servers', function (req, res) {
    if (req.session.adminPass === ADMIN_PASSWORD) {
        res.render("admin-view/servers", {
            "username": req.session.username === undefined ? "root" : req.session.username
        });
        res.end();
        return;
    } else {
        res.send("403 access forbidden");
    }
    res.end();
});

module.exports = {app}