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

//TODO: поменять ключ
app.use(session({secret: generateToken(32), cookie: {maxAge: 604800000}})) // 1 week

app.post('/signin', function (req, res) {
    if (req.session.login) {
        res.statusCode = 403;
        res.json(
            {
                "error": "pashol na hui"
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

        req.session.login = req.body.username;
        res.end()
    });
});

module.exports = {
    app,
    setDb
}