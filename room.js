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

  addUser(id) {
    if (id in this.#users)
      return false;

    this.#users[id] = {};
    return true;
  };

  getName() {
    return this.#name;
  };

  leave(userid) {
    delete this.#users[userid];

    if (Object.entries(this.#users).length === 0) this.#onEmpty();
  };

  report() {
    return {
      name: this.#name,
      requirepw: this.#password !== "",
      //capacity?
    }
  }
};

module.exports = Room;