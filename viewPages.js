const express = require('express');

let app = express.Router();

//TODO: авторизация
app.get('/server', function (req, res) {
    if (req.session.username === undefined) {
        res.send('403 access forbidden');
        res.end();
        return;
    }
    res.render('server_list', {
        'username': req.session.username
    });
});

app.get('/', function (req, res) {
    if (req.session.username !== undefined) {
        res.redirect('/server');
        res.end();
        return;
    }
    res.render('index');
});

module.exports = app