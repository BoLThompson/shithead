class Room {
  #name;
  #password;
  #users;
  #onEmpty;

  constructor(name, password, onEmpty) {
    this.#name = name;
    this.#password = password;
    this.#users = {};
    this.#onEmpty = onEmpty;
  };

  addUser(user, pw="") {
    console.log("Room.addUser")
    console.log(`pw=${pw}`)
    console.log(user)
    if (user.getID() in this.#users)
      return false;

    if (pw !== this.#password) return false;

    this.#users[user.getID()] = {
      name:user.getName()
    };
    return true;
  };

  getName() {
    return this.#name;
  };

  leave(userid) {
    delete this.#users[userid];

    if (Object.entries(this.#users).length === 0) this.#onEmpty();
  };

  getDetails() {
    return {
      users: Object.entries(this.#users).map(([k,v]) => ({
        name: v.name
      })),
      state:"gathering",  //FIXME: the state of the game can be here :)
    }
  };

  report() {
    return {
      name: this.#name,
      requirepw: this.#password !== "",
      //capacity?
    }
  };
};

module.exports = Room;