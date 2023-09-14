const uuid = require('uuid');

class UserList {
  static users = [];

  static get all() {
    return [...UserList.users];
  }

  static add(name) {
    if (UserList.findByName(name)) {
      return null;
    }
    const id = uuid.v4();
    const user = { id, name };
    UserList.users.push(user);
    return user;
  }

  static findByName(name) {
    return UserList.users.find((user) => user.name === name);
  }

  static findById(id) {
    return UserList.users.find((user) => user.id === id);
  }

  static remove(user) {
    if (!UserList.users.includes(user)) return false;
    UserList.users = UserList.users.filter((item) => item !== user);
    return true;
  }
}

module.exports = UserList;
