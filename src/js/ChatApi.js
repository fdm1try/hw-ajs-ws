export default class ChatApi {
  #listeners = [];

  #wsPingTimestamp;

  static get endpoint() {
    // eslint-disable-next-line no-undef
    return `http://${SERVER_HOST}:${SERVER_PORT}/`;
  }

  static get wsEndpoint() {
    // eslint-disable-next-line no-undef
    return `ws://${SERVER_HOST}:${SERVER_PORT}/ws`;
  }

  static async post(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error(`Не удалось прочитать ответ: ${e}`);
    }
    if (!response.ok) {
      const err = data && data.error ? data.error : `HTTP error code ${response.status} (${response.statusText})`;
      throw new Error(err);
    }
    return data;
  }

  static registerUser(nickname) {
    return ChatApi.post(`${ChatApi.endpoint}users/register`, { nickname });
  }

  static sendMessage(userId, message) {
    return ChatApi.post(`${ChatApi.endpoint}messages/send`, { userId, message });
  }

  constructor() {
    this.wsTimeout = 5000;
    this.onNewMessage = this.onNewMessage.bind(this);
    this.onUserConnect = this.onUpdateUserList.bind(this);
    this.onSubscribeError = this.onSubscribeError.bind(this);
    this.onWebSocketMessage = this.onWebSocketMessage.bind(this);
    this.checkWebSocketConnection = this.checkWebSocketConnection.bind(this);
    this.onWebSocketPingMessage = this.onWebSocketPingMessage.bind(this);
    this.onWebSocketTimeout = this.onWebSocketTimeout.bind(this);
  }

  connectWS() {
    return new Promise((resolve) => {
      this.ws = new WebSocket(ChatApi.wsEndpoint);
      this.ws.addEventListener('error', this.onWebSocketClose);
      this.ws.addEventListener('open', () => {
        this.checkWebSocketConnection();
        resolve();
      });
      this.ws.addEventListener('close', () => this.init);
      this.ws.addEventListener('message', this.onWebSocketMessage);
    });
  }

  checkWebSocketConnection() {
    if (!this.#wsPingTimestamp) {
      this.#wsPingTimestamp = Date.now();
    } else if (Date.now() - this.#wsPingTimestamp > this.wsTimeout) {
      this.onWebSocketTimeout();
      this.ws.close();
      this.#wsPingTimestamp = null;
      return;
    }
    setTimeout(this.checkWebSocketConnection, this.wsTimeout);
  }

  subscribeWS(data) {
    this.ws.send(JSON.stringify({ type: 'subscribe', data }));
  }

  addNewMessageEventListener(callback) {
    this.#listeners.push({ type: 'newMessage', callback });
  }

  addUpdateUserListEventListener(callback) {
    this.#listeners.push({ type: 'onUpdateUserList', callback });
  }

  addUserDisconnectEventListener(callback) {
    this.#listeners.push({ type: 'userDisconnect', callback });
  }

  addWebsocketCloseEventListener(callback) {
    this.#listeners.push({ type: 'wsClose', callback });
  }

  addWebsocketTimeoutEventListener(callback) {
    this.#listeners.push({ type: 'wsTimeout', callback });
  }

  addSubscribeErrorEventListener(callback) {
    this.#listeners.push({ type: 'subscribeError', callback });
  }

  onWebSocketMessage(event) {
    const { type, data, error } = JSON.parse(event.data);
    if (type === 'ping') this.onWebSocketPingMessage();
    else if (type === 'subscribeError') this.onSubscribeError(error);
    else if (type === 'updateChatUsers') this.onUpdateUserList(data);
    else if (type === 'newMessage') this.onNewMessage(data);
  }

  onWebSocketPingMessage() {
    this.#wsPingTimestamp = Date.now();
  }

  onWebSocketTimeout() {
    for (const listener of this.#listeners) {
      if (listener.type === 'wsTimeout') listener.callback();
    }
  }

  onWebSocketClose() {
    for (const listener of this.#listeners) {
      if (listener.type === 'wsClose') listener.callback();
    }
  }

  onNewMessage(data) {
    for (const listener of this.#listeners) {
      if (listener.type === 'newMessage') listener.callback(data);
    }
  }

  onUpdateUserList(users) {
    for (const listener of this.#listeners) {
      if (listener.type === 'onUpdateUserList') listener.callback(users);
    }
  }

  onSubscribeError(data) {
    for (const listener of this.#listeners) {
      if (listener.type === 'subscribeError') listener.callback(data);
    }
  }
}
