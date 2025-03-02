class User {
  #socket;
  #name;
  #disconnectListeners;
  #onCreateRoom;
  #getRoomData;
  
  constructor(socket, onCreateRoom, getRoomData) {
    this.#socket = socket;
    socket.join("lobby");
    this.#name = "";
    this.#disconnectListeners = [];
    this.#onCreateRoom = onCreateRoom;
    this.#getRoomData = getRoomData;
    // this.#roomChangeListeners = [];

    this.#setState("new");
  };

  #setState(state) {
    this.#socket.removeAllListeners();
    this.#socket.on("disconnect", ()=>{
      this.#disconnect();
    });
    this.#socket.on("queryRooms", (data, callback) => {
      callback(this.#getRoomData());
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
          //ask to create the room
          if (!this.#onCreateRoom(roomdata)) {
            //if no, callback that
            callback({
              accept:false,
              reason:"A room with that name already exists."
            })

            return;
          }

          
          this.#socket.broadcast.to("lobby").emit("roomData", 
            this.#getRoomData()
          )

          this.#setState("gathering");
        }
      },
      // gathering: {},
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

  /**
   * Adds a listener to the disconnect event
   * @param {*} callback a callback to execute upon disconnect
   */
  addDisconnectListener(callback) {
    this.#disconnectListeners.push(callback);
  }

  #disconnect(reason){
    this.#disconnectListeners.forEach(callback => callback(reason));
  }
  
  // #roomChange(oldroom, newroom){
  //   this.#roomChangeListeners = 
  //     this.#roomChangeListeners
  //     //callbacks which return false will no longer be unregistered
  //     .filter(callback => callback(oldroom, newroom));
  // }

  getID() {
    return this.#socket.id;
  }

  print() {
    return `Name: "${this.#name}"\n` +
      `Id: ${this.#socket.id}`
  }
};

module.exports = User;