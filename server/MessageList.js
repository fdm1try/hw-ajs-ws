class MessageList {
  static messages = [];

  static newMessageListeners = [];

  static add(user, message, date) {
    const messageItem = { user, message, date };
    MessageList.messages.push(messageItem);
    MessageList.onNewMessage(messageItem);
  }

  static addNewMessageEventListener(callback) {
    MessageList.newMessageListeners.push(callback);
  }

  static onNewMessage(message) {
    MessageList.newMessageListeners.forEach((callback) => callback(message));
  }
}

module.exports = MessageList;
