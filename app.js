//environment variables from the .env file
require('dotenv').config();

//server stuff
const express = require('express');
const cors = require('cors');
// const http = require('http');
// const path = require('path');
// const https = require('https');

// const fs = require('node:fs');

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

io.on('connect', (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  socket.on("pickname", (name, callback) => {
    console.log(`socket id ${socket.id} chose name ${name}`);

    //tell the user that this name is fine
    callback({
      accept:true
    })
  })

  socket.on("makeroom", (roomdata, callback) => {

    console.log(`socket id ${socket.id} made a room with some details like this:`);
    console.log(roomdata);

    socket.broadcast.emit("roomData", []);

    callback({
      accept: true
    })
  })

  socket.on("disconnect", (reason) => {
    console.log(`disconnect from socket id ${socket.id}`);
    console.log(reason);
  });
})

io.on('disconnect', (socket) => {
  console.log(`a user disconnected with id ${socket.id}`);
})