import Modal from './Modal';
import ChatMessage from './ChatMessage';

export default class Chat {
  #sendListeners = [];

  #messages = [];

  #users = new Map();

  static get markup() {
    return `
      <div class="chat">
        <div class="chat-users">
          <h2 class="chat-users-header">онлайн</h2>
          <div class="chat-users-list">
          </div>
        </div>
        <div class="chat-body">
          <div class="chat-messages-container">
            <div class="chat-messages">
            </div>
          </div>
          <form class="chat-send">
            <input required type="text" class="chat-send-message_input">
            <button class="chat-send-message_button">Отправить</button>
          </form>
        </div>
      </div>
    `;
  }

  static get selector() {
    return '.chat';
  }

  static get selectorChatUsers() {
    return '.chat-users-list';
  }

  static get selectorChatMessages() {
    return '.chat-messages';
  }

  static get selectorChatSendForm() {
    return '.chat-send';
  }

  static get selectorChatMessageInput() {
    return '.chat-send-message_input';
  }

  static get selectorChatMessageButton() {
    return '.chat-send-message_button';
  }

  constructor() {
    this.onMessageSend = this.onMessageSend.bind(this);
    this.onMessageSendConfirm = this.onMessageSendConfirm.bind(this);
    this.onMessageSendReject = this.onMessageSendReject.bind(this);
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = Chat.markup;

    this.elChatUsers = this.container.querySelector(Chat.selectorChatUsers);
    this.elChatMessages = this.container.querySelector(Chat.selectorChatMessages);
    this.elSendForm = this.container.querySelector(Chat.selectorChatSendForm);
    this.elSendMessageInput = this.container.querySelector(Chat.selectorChatMessageInput);
    this.elSendMessageButton = this.container.querySelector(Chat.selectorChatMessageButton);

    this.elSendMessageInput.focus();

    this.registerEvents();
  }

  registerEvents() {
    this.elSendForm.addEventListener('submit', this.onMessageSend);
  }

  addMessage(message) {
    if (!(message instanceof ChatMessage)) {
      throw new Error('addMessage(message) error: message should be an instance of ChatMessage!');
    }
    this.#messages.push(message);
    this.elChatMessages.appendChild(message.htmlElement);
    return message;
  }

  addUser(username) {
    const userEl = document.createElement('div');
    userEl.classList.add('chat-user');
    userEl.textContent = username;
    this.#users.set(username, userEl);
    this.elChatUsers.appendChild(userEl);
  }

  removeAllUsers() {
    this.#users = new Map();
    this.elChatUsers.innerHTML = '';
  }

  addSendMessageEventListener(callback) {
    this.#sendListeners.push(callback);
  }

  onMessageSend(event) {
    event.preventDefault();
    const message = this.elSendMessageInput.value;
    this.elSendMessageInput.disabled = true;
    this.elSendMessageButton.disabled = true;
    this.#sendListeners.forEach(
      (callback) => callback(message, this.onMessageSendConfirm, this.onMessageSendReject),
    );
  }

  onMessageSendConfirm() {
    this.elSendMessageInput.value = '';
    this.elSendMessageInput.disabled = false;
    this.elSendMessageButton.disabled = false;
    this.elSendMessageInput.focus();
  }

  onMessageSendReject(error) {
    this.elSendMessageInput.disabled = false;
    this.elSendMessageButton.disabled = false;
    Modal.showError(`Не удалось отправить сообщение, причина: ${error.message}`);
  }
}
