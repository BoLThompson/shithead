const Room = require("./room.js");


class GameManager {
  #rooms;
  
  constructor() {
    this.#rooms = {};
  };

  getRoomData() {
    return Object.entries(this.#rooms).map(([k,v]) => v.report());
  };

  makeRoom(user, roomdata) {

    if (roomdata.name in this.#rooms) return false;

    const newRoom = new Room(roomdata.name, roomdata.pw,
      //callback to delete this room once it's empty
      () => {
        delete this.#rooms[roomdata.name];
      }
    );
    newRoom.addUser(user);
    this.#rooms[roomdata.name] = newRoom;

    return newRoom;
  };

  joinRoom(user, roomdata) {
    //check if the room exists
    if (!(roomdata.name in this.#rooms)) return false;

    //ask to join it
    if (!this.#rooms[roomdata.name].addUser(user, roomdata.pw)) return false;

    return this.#rooms[roomdata.name];
  }
};

module.exports = GameManager;
