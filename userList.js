const User = require("./user.js");

class UserList {
  constructor() {
    this.users = {}
  };
  
  addUser(socket) {
    //ensure no double adds
    if (socket.id in this.users) {
      return false;
    }

    //add em in
    this.users[socket.id] = new User(socket, () => {
      delete this.users[socket.id];
    });

    //report success
    return this.users[socket.id];
  }

  

  getUser(id) {
    return this.users[id] || false;
  }

  print() {
    return "\tUser List:\n"+
    Object.entries(this.users).map(([k,v]) => v.print()).join("\n\n");
  }
};

module.exports = UserList;
