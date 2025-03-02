//environment variables from the .env file
require('dotenv').config();

//server stuff
const express = require('express');
const cors = require('cors');
// const http = require('http');
// const path = require('path');
// const https = require('https');

// const fs = require('node:fs');
const UserList = require("./userList.js");

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


const userList = new UserList();

io.on('connect', (socket) => {
  userList.addUser(socket);
})