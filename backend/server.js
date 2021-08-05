const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const {CardDatabase, Deck} = require('./models/cards');
const Client = require('./models/client')
const Application = require('./models/application');

// --------------------------------------
// Setup
// --------------------------------------
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.get("*", (req, res) => {
    res.send("HEllo world");
});

// --------------------------------------
// Services
// --------------------------------------
const cards = new CardDatabase();
const setsPath = path.join(__dirname, "data", "sets");
for(let file of fs.readdirSync(setsPath)) {
    const setId = path.parse(file).name;
    const setPath = path.join(setsPath, file);
    cards.addSet(setId, JSON.parse(fs.readFileSync(setPath, "utf-8")));
}

const cardsApp = new Application(cards);

// --------------------------------------
// Socket
// --------------------------------------
io.on("connection", socket => new Client(socket, cardsApp));

// --------------------------------------
// Server Startup
// --------------------------------------
app.set("port", 3000);
server.listen(port, () => {
    console.log(`Started Server on ${port}`);
});