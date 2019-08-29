const express = require("express");
const path = require('path');
const cookieSession = require('cookie-session');
let app  = express();

app.use(cookieSession({
    name: 'session',
    secret: 'mySecretKey'
}));

const resPath = path.join(__dirname, 'res');
//  Load the main page
app.get('/', function (req, res) {
    //  Demo of how to use session-cookies.
    req.session.views = (req.session.views || 0) + 1;
    console.log(req.session.views);

    res.sendFile('index.html', { root: resPath});
});

//  Another page
app.get('/lobby', function (req, res) {
    res.sendFile('lobby.html', { root: resPath});
});

let server = app.listen(3000, function () {
    console.log("Server started.");
});