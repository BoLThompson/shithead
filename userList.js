const User = require("./user.js");


class UserList {
  #users;
  #rooms;
  
  constructor() {
    this.#users = {};
    this.#rooms = {};
  };
  
  addUser(socket) {
    //ensure no double adds
    if (socket.id in this.#users) {
      return false;
    }

    //add em in
    const newUser = new User(
      socket,
      (roomdata) => {
        console.log(roomdata);
        //if the room name is taken, say no
        if (roomdata.name in this.#rooms) return false;

        //create the room
        this.#rooms[roomdata.name] = roomdata;

        return true;
      },
      () => {
        return Object.entries(this.#rooms).map(([k,v]) => v);
      }
    );
    this.#users[socket.id] = newUser;

    //teach em to clean up after himself
    newUser.addDisconnectListener(() => {
      delete this.#users[socket.id];
    });

    //report success
    return this.#users[socket.id];
  }  

  getUser(id) {
    return this.#users[id] || false;
  }

  print() {
    //user list
    return "\tUser List:\n"+
    Object.entries(this.#users).map(([k,v]) => v.print())
    .join("\n===\n") /*+
    //room list
    "\tRoom List:\n"+
    //tab before each room's output
    Object.entries(this.#rooms).map(([k,v]) => v.print())
    //separate each room by a newline
    .join("\n===\n"); */
  }
};

module.exports = UserList;
