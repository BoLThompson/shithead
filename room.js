class Room {
  #name;
  #password;
  #users;
  #onDestroy;

  constructor(name, password, onDestroy) {
    this.#name = name;
    this.#password = password;
    this.#users = {};
    this.#onDestroy = onDestroy;
  };

  addUser(id) {
    if (id in this.#users)
      return false;

    this.#users[id] = {};
    return true;
  }

  removeUser(id) {
    if (!(id in this.#users))
      return false;

    delete this.#users[id];

    if (Object.keys(this.#users).length === 0) {
      this.#onDestroy();
    }
    
    return true;
  }

  report() {
    return {
      name: this.#name,
      requirepw: this.#password !== "",
      //capacity?
    }
  }
};

module.exports = Room;