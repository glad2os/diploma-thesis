const express = require('express');

let app = express.Router();
let usersApi = require('./api/users/users')


const adminPage = require('./admin/admin');
app.use('/admin', adminPage.app);

app.get('/server', function (req, res) {
    if (req.session.username === undefined || req.session.username === "") {
        res.redirect('/');
        res.end();
        return;
    }

    usersApi.getAvailableServers(req.session.username, (response) => {
        res.render('server_list', {
            'username': req.session.username,
            'servers': response
        });
    });
});

app.get('/', function (req, res) {
    if (req.session.username === undefined || req.session.username === "") {
        res.render('index');
        res.end();

    } else {
        res.redirect('/server');
    }
});

app.get('/exit', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.get('/chat', function (req, res) {
    if (req.session.username === "" || req.session.username === undefined || req.query.server === undefined) {
        res.send('403 access forbidden');
        res.end();
        return;
    }

    usersApi.getServerImg(req.query.server, (response) => {
        if (response === undefined) {
            res.redirect('/server');
            res.end();
            return;
        }

        res.render('chat.ejs', {
            'username': req.session.username,
            'room': req.query.server,
            'server_img': response['img_path'],
            'admin_gear': req.session.adminPass ? 1 : 0
        });
    });
});


module.exports = app