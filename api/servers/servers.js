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

app.post('/selectall', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    let sql = `select * from servers`;

    db.all(sql, req.body.limit, req.body.amount, (err, rows) => {
        if (err) {
            res.json(
                {"error": err});
        }
        res.json(rows);
    });
});
app.post('/updatelist', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }
    let sql = `delete from users_server_list where user_id = (select id from users where username = ? )`;

    db.run(sql, req.body.username, (err, data) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
    });


    sql = `insert into users_server_list (user_id, server_id) values`; // ((select id from users where username = "gladdos"),?)`
    for (let i = 0; i < req.body.serversids.length; i++) {
        let prepare = sql + '((select id from users where username = "' + req.body.username + '"),' + req.body.serversids[i] + ")";
        db.run(prepare, [], (err, data) => {
            if (err) {
                res.json(
                    {
                        "error": err
                    }
                );
            }
        });
    }
    res.end();
});
app.post("/remove/:id", function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }
    let sql = `delete from servers where  id = ?`;
    db.all(sql, req.params.id, (err, data) => {
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

app.post('/regServer', function (req, res) {
    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }
    let img_path = "";
    if (req.body.img_path.length > 0) img_path = "/assets/img/" + req.body.img_path;

    let sql = `insert into servers (name, img_path) VALUES (?,?)`;
    db.all(sql, req.body.name, img_path, (err, data) => {
        if (err) {
            res.json(
                {
                    "error": err
                }
            );
        }
        res.statusCode = 200;
        res.end();
    });
});

module.exports = {
    app,
    setDb
}