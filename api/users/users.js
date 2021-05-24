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


/*
 * ADMIN API
 *
 */
const ADMIN_PASSWORD = typeof process.env.ADMIN_PASSWORD === 'undefined' ? "test" : process.env.ADMIN_PASSWORD;

app.post('/reguser', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        res.statusCode = 403;
        res.json(
            {
                "error": "Лимиты не заданы"
            }
        );
        return;
    }

    let sql = `insert into users  (username,password_hash) values (?,?)`;

    db.get(sql, req.body.username, md5(req.body.password), (err) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
        res.end();
    });
});


app.post('/updateuser', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    if (typeof req.body.username === "undefined" ||
        typeof req.body.password === "undefined" ||
        typeof req.body.id === "undefined") {
        res.statusCode = 403;
        res.json(
            {
                "error": "Лимиты не заданы"
            }
        );
        return;
    }

    let sql = `UPDATE users SET username = ?, password_hash = ? where id = ?`;

    db.get(sql, req.body.username, md5(req.body.password), req.body.id, (err) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
        res.end();
    });
});

app.post('/removeuser', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        res.statusCode = 403;
        res.json(
            {
                "error": "Лимиты не заданы"
            }
        );
        return;
    }

    let sql = `delete FROM users WHERE id= ?`;

    db.get(sql, req.body.id, (err) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
        res.end();
    });
});


app.post('/getAvailableServers', function (req, res) {
    getAvailableServers(req.body.username, (value) => {
        res.json(value);
    });
});

app.post('/getCountUsers', function (req, res) {
    let sql = `select count(*) as count from users`;
    db.all(sql, [], (err, data) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
        res.json(data[0]);
        res.end();
    });
});

app.post('/get-all', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    if (typeof req.body.limit === "undefined" || typeof req.body.amount === "undefined") {
        res.statusCode = 403;
        res.json(
            {
                "error": "Лимиты не заданы"
            }
        );
        return;
    }

    let sql = `select * from users  ORDER BY id limit ?, ?`;

    db.all(sql, req.body.limit, req.body.amount, (err, rows) => {
        if (err) {
            res.json(
                {"error": err});
        }
        res.json(rows);
    });
});

module.exports = {
    app,
    setDb,
    getSession,
    getAvailableServers,
    getServerImg
}