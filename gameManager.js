const Room = require("./room.js");


class GameManager {
  #rooms;
  
  constructor() {
    this.#rooms = {};
  };

  getRoomData() {
    return Object.entries(this.#rooms).map(([k,v]) => v.report());
  };

  makeRoom(userid, roomdata) {

    if (roomdata.name in this.#rooms) return false;

    const newRoom = new Room(roomdata.name, roomdata.pw,
      //callback to delete this room once it's empty
      () => {
        delete this.#rooms[roomdata.name];
      }
    );
    newRoom.addUser(userid);
    this.#rooms[roomdata.name] = newRoom;

    return newRoom;
  };
};

module.exports = GameManager;
