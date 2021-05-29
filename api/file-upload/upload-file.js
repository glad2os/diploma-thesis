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

app.post('/', function (req, res) {
    //todo: check user
    let newPath = __dirname + "../../../uploads/";
    let array = Object.values(req.files);
    array.forEach(value => {
        fs.writeFile(newPath + value.name, value.data, function (err) {
            if (err) res.json(err.message);
        });
    })

    res.end();
});

module.exports = {
    app
}