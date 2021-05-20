const express = require('express');

let md5 = require('md5');
let moment = require('moment');
let session = require('express-session');

let app = express.Router();
let db;

function setDb(_db) {
    db = _db;
}

function generateToken(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+|';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

let _session = session({secret: "set", saveUninitialized: true, resave: true, cookie: {maxAge: 604800000}});
//TODO: поменять ключ
app.use(_session) // 1 week

function getSession() {
    return _session;
}

function getServerImg(name, callback) {
    let sql = 'SELECT img_path from servers where name = ?';

    db.get(sql, name, (err, response) => {
        if (err) {
            throw err;
        }
        return callback(response);
    });
}

function getAvailableServers(username, callback) {
    let sql = 'SELECT name, img_path from servers inner join users_server_list usl on servers.id = usl.server_id inner join users u on u.id = usl.user_id where u.username=?';

    db.all(sql, username, (err, response) => {
        if (err) {
            throw err;
        }
        return callback(response);
    });
}

app.post('/signin', function (req, res) {
    if (req.session.login) {
        res.statusCode = 403;
        res.json(
            {
                "error": "access forbidden"
            }
        );
        return;
    }

    if (req.body.username === undefined || req.body.password === undefined) {
        res.statusCode = 400;
        res.json(
            {
                "error": "Поля не введены"
            }
        );
        return;
    }

    let sql = `SELECT * FROM users where username = ? and password_hash = ?`;

    db.get(sql, req.body.username, md5(req.body.password), (err, user) => {
        if (err) {
            throw err;
        }
        if (user === undefined) {
            res.statusCode = 400;
            res.json({
                "error": "Неверный логин или пароль"
            });
            return;
        }

        req.session.username = req.body.username;
        res.end()
    });
});

module.exports = {
    app,
    setDb,
    getSession,
    getAvailableServers,
    getServerImg
}
