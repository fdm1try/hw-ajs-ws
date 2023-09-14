import ChatApi from './ChatApi';
import Chat from './Chat';
import ChatMessage from './ChatMessage';
import Modal from './Modal';

export default class ChatController {
  constructor(container) {
    this.container = container;
    this.chat = new Chat();
    this.api = new ChatApi();

    this.onMessageSend = this.onMessageSend.bind(this);
    this.init = this.init.bind(this);
    this.onInit = this.onInit.bind(this);
    this.render = this.render.bind(this);
    this.onSubscribeError = this.onSubscribeError.bind(this);
    this.onUpdateUserList = this.onUpdateUserList.bind(this);
    this.onNewMessage = this.onNewMessage.bind(this);
    this.onWebsocketClose = this.onWebsocketClose.bind(this);
    this.onWebsocketTimeout = this.onWebsocketTimeout.bind(this);

    this.registerEvents();
  }

  registerEvents() {
    this.chat.addSendMessageEventListener(this.onMessageSend);
    this.api.addUpdateUserListEventListener(this.onUpdateUserList);
    this.api.addSubscribeErrorEventListener(this.onSubscribeError);
    this.api.addNewMessageEventListener(this.onNewMessage);
    this.api.addWebsocketCloseEventListener(this.onWebsocketClose);
    this.api.addWebsocketTimeoutEventListener(this.onWebsocketTimeout);
  }

  init() {
    this.container.innerHTML = '';
    Modal.inputTextDialog('Выберите псевдоним').then(this.onInit);
  }

  onInit(nickname) {
    ChatApi.registerUser(nickname).then((data) => {
      this.user = data;
      this.api.connectWS().then(() => {
        this.api.subscribeWS(this.user.id);
        this.render();
      });
    }).catch((error) => {
      const text = error.code === 401 ? 'Псевдоним занят, введите другой.' : `Не удалось войти (${error.message}), попробуйте снова.`;
      Modal.showError(text).then(this.init);
    });
  }

  render() {
    this.chat.render(this.container);
  }

  onSubscribeError(error) {
    Modal.showError(`Ошибка входа (${error.message})`).then(this.init);
  }

  onUpdateUserList(users) {
    this.chat.removeAllUsers();
    for (const user of users) {
      if (user.name !== this.user.name) this.chat.addUser(user.name);
    }
    this.chat.addUser('You');
  }

  onMessageSend(message, confirm, reject) {
    ChatApi.sendMessage(this.user.id, message).then(confirm).catch(reject);
  }

  onNewMessage(data) {
    const { name, message, date } = data;
    this.chat.addMessage(new ChatMessage(name, message, date, this.user.name === name));
  }

  onWebsocketClose(error) {
    Modal.showError(`Потеряно соединение с сервером (${error?.message || 'неизвестная ошибка'})`)
      .then(this.init);
  }

  onWebsocketTimeout() {
    Modal.showError('Сервер не отвечает длительное время.').then(this.init);
  }
}
