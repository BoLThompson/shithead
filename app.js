//environment variables from the .env file
require('dotenv').config();

//server stuff
const express = require('express');
const cors = require('cors');
// const http = require('http');
// const path = require('path');
// const https = require('https');

// const fs = require('node:fs');
const GameManager = require("./gameManager.js");
const User = require('./user.js');

const PORT = process.env.PORT || 8080

//spin up the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})

//attach socket.io to it
const io = require('socket.io')(server, {
  //enabling cors might be needed for the dev server?
  cors: {origin:'*'}
})


const gm = new GameManager();

io.on('connect', (socket) => {
  const me = new User(socket, gm);
})