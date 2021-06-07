const express = require('express');
const fs = require('fs');

let md5 = require('md5');
const {getCurrentUser} = require('../../utils/users');


let app = express.Router();

const fileupload = require("express-fileupload");
app.use(fileupload());

app.get("/getfile/:fileId", function (req, res) {
    res.send(req.params)
});

const ADMIN_PASSWORD = typeof process.env.ADMIN_PASSWORD === 'undefined' ? "test" : process.env.ADMIN_PASSWORD;

app.post('/addServerImg', function (req, res) {

    if (req.session.adminPass !== ADMIN_PASSWORD) {
        res.statusCode = 403;
        res.json(
            {
                "error": "Нет доступа к админ панели"
            }
        );
        return;
    }

    let newPath = __dirname + "/../../public/assets/img/";
    let array = Object.values(req.files);
    array.forEach(value => {
        fs.writeFile(newPath + value.name, value.data, function (err) {
            if (err) res.json(err.message);
        });
    });

    res.end();
});

app.post('/', function (req, res) {
    if (req.session.username === "" || req.session.username === undefined) {
        res.send('403 access forbidden');
        res.end();
        return;
    }

    let newPath = __dirname + "/../../uploads/";

    let array = Object.values(req.files);

    if (fs.existsSync(newPath)) {
        array.forEach(value => {
            fs.writeFile(newPath + value.name, value.data, function (err) {
                if (err) res.json(err.message);
            });
        });
    }
    res.end();
});

module.exports = {
    app
}