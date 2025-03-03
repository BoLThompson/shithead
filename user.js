class User {
  #socket;
  #name;
  #gm;
  #room;
  #io;
  
  constructor(socket, gameManager, io) {
    this.#socket = socket;
    socket.join("lobby");
    this.#name = "";
    this.#gm = gameManager;
    this.#room = null;
    this.#io = io;

    this.#setState("new");
  };

  #setState(state) {
    this.#socket.removeAllListeners();
    this.#socket.on("disconnect", ()=>{
      if (this.#room)
        this.#room.leave(this.#socket.id);
    });

    this.#socket.on("queryRooms", (data, callback) => {
      callback(this.#gm.getRoomData());
    });

    const states = {
      new: {
        pickname: (name, callback) => {
          //please actually pick a name
          if (name === "") return callback({accept: false});

          //save it
          this.#name = name;

          //report success
          callback({
            accept:true
          });

          //move to lobby state
          this.#setState("lobby");
        }
      },
      lobby: {
        joinRoom: (roomdata, callback) => {
          //ask the if the room can be joined
          const newRoom = this.#gm.joinRoom(this, roomdata);

          //if no, nothing happens
          if (!newRoom) return callback({accept:false});

          //if so, join the room
          this.#socket.join(roomdata.name);
          //leave the lobby
          this.#socket.leave("lobby");
          //hold onto a reference for this
          this.#room = newRoom;

          this.#socket.broadcast.to(roomdata.name).emit("roomDetails", this.#room.getDetails());

          this.#setState("gathering");
          callback({accept:true});
        },
        makeroom: (roomdata, callback) => {
          const newRoom = this.#gm.makeRoom(this, roomdata);
          //if we can create and join this room
          if (!newRoom) {
            callback({
              accept:false,
              reason:"A room with that name already exists."
            })
            return;
          }

          this.#socket.leave("lobby");
          this.#socket.join(newRoom.getName());
          this.#room = newRoom;

          //let everyone know we made one
          this.#socket.broadcast.to("lobby").emit("roomData", this.#gm.getRoomData());
          
          callback({
            accept:true,
          })

          this.#setState("gathering");
        }
      },
      gathering: {
        tolobby: ()=>{
          this.#toLobby();
        },
        queryRoom: (args, callback) => {
          callback(this.#room.getDetails());
        },
        chat: (msg) => {
          this.#io.to(this.#room.getName()).emit("chat", {
            msg:msg,
            user: this.#name,
            time: (new Date()).toString()
          })
        }
      },
      // starting: {},
      // arranging: {},
      // waiting: {},
      // playing: {},
    }

    if (!(state in states)) return console.log(`bad state ${state}`);

    Object.entries(states[state]).map(([event,handler]) => {
      this.#socket.on(event,handler);
    })
  }

  getID() {
    return this.#socket.id;
  }

  getName() {
    return this.#name;
  }

  print() {
    return `Name: "${this.#name}"\n` +
      `Id: ${this.#socket.id}`
  }

  #toLobby() {
    //join the lobby
    this.#socket.join("lobby");

    //don't dereference null pointers
    if (this.#room) {
      //leave the socket.io room
      this.#socket.leave(this.#room.getName());
      //tell the Room instance that we're gone
      this.#room.leave(this.#socket.id);
      //tell everyone that we left
      this.#socket.broadcast.to(this.#room.getName()).emit("roomDetails", this.#room.getDetails());
      //null this pointer
      this.#room = null;
    }
    
    //tell the GM to update everyone's roomData
    this.#socket.broadcast.to("lobby").emit("roomData", this.#gm.getRoomData());

    this.#setState("lobby");
  }
};

module.exports = User;