const express = require('express');

let app = express.Router();

let db;

function setDb(_db) {
    db = _db;
}

const ADMIN_PASSWORD = typeof process.env.ADMIN_PASSWORD === 'undefined' ? "test" : process.env.ADMIN_PASSWORD;

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

    let sql = `select * from servers  ORDER BY id limit ?, ?`;

    db.all(sql, req.body.limit, req.body.amount, (err, rows) => {
        if (err) {
            res.json(
                {"error": err});
        }
        res.json(rows);
    });
});


app.post('/getCountServers', function (req, res) {
    let sql = `select count(*) as count from servers`;
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


module.exports = {
    app,
    setDb
}