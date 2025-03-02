class User {
  #socket;
  #name;
  #gm;
  #room;
  
  constructor(socket, gameManager) {
    this.#socket = socket;
    socket.join("lobby");
    this.#name = "";
    this.#gm = gameManager;
    this.#room = null;

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
        joinroom: (roomname, callback) => {
          //ask the if the room can be joined
          //if no, nothing happens
          //if so, join the room
            //leave the lobby
        },
        makeroom: (roomdata, callback) => {
          const newRoom = this.#gm.makeRoom(this.#socket.id, roomdata);
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

  print() {
    return `Name: "${this.#name}"\n` +
      `Id: ${this.#socket.id}`
  }

  #toLobby() {
    this.#socket.leave(this.#room.getName());
    this.#socket.join("lobby");
    this.#room.leave(this.#socket.id);
    
    this.#socket.broadcast.to("lobby").emit("roomData", this.#gm.getRoomData());

  }
};

module.exports = User;