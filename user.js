class User {
  #socket;
  #name;
  #disconnectCallback;
  
  constructor(socket, onDisconnect) {
    this.#socket = socket;
    this.#name = "";
    this.#disconnectCallback = onDisconnect;

    this.#setState("new");
  };

  #setState(state) {
    this.#socket.removeAllListeners();
    this.#socket.on("disconnect", this.#disconnectCallback);

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
      }
    }

    if (!(state in states)) return console.log(`bad state ${state}`);

    Object.entries(states[state]).map(([event,handler]) => {
      this.#socket.on(event,handler);
    })
  }

  print() {
    return `Name: "${this.name}"\n` +
      `Id: ${this.socket.id}`
  }
};

module.exports = User;