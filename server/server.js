// Dependencies - objects/functions
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');

// Setting up express (popular HTTP framework)
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

// Serve static files (i.e. CSS, images, HTML, ...)
app.use(express.static(clientPath));

// Create a server which needs a listener function -> 
// whenever a client is connecting send it to express to handle. 
const server = http.createServer(app);

// Notifies when the server crashes through an event-listener.
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Server listens to port 8080.
const port = 8080;
server.listen(port, () => {
    console.log('Game started on ' + port);
});

// Setting up socket io on the server
const io = socketio(server);

let waitingPlayer = null;

// Emit an event whenever a user is connected to the server.
io.sockets.on('connection', (socket) => {
    if(waitingPlayer) {
        new Game(waitingPlayer, socket);
        waitingPlayer = null;
    } else {
        waitingPlayer = socket;
        waitingPlayer.emit('message', {msg: 'Waiting for an opponent...'});
    }
});
