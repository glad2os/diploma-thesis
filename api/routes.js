const express = require('express');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./wtchat.db');

let app = express.Router();
app.get('/', function (req, res) {
    res.json({
        'author': "glad2os",
        'version': "v.228"
    });
});

app.get('/get_all_servers', function (req, res) {
    // if (req.query.user === undefined || req.query.password_hash === undefined) {
    //     res.json(
    //         {
    //             'error': "no data"
    //         });
    //     return;
    // }

    let sql = `SELECT * FROM servers`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });

    db.close();
});

module.exports = app