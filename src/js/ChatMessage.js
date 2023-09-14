import moment from 'moment';

export default class ChatMessage {
  #author;

  #message;

  #date;

  #isUser;

  static get className() {
    return 'chat-message';
  }

  static get markup() {
    return `
      <div class="${ChatMessage.className}-header">
        <div class="${ChatMessage.className}-header-author"></div>
        ,&nbsp;
        <div class="${ChatMessage.className}-header-date"></div>
      </div>
      <div class="${ChatMessage.className}-content"></div>
    `;
  }

  static get selector() {
    return `.${ChatMessage.className}`;
  }

  static get selectorDate() {
    return `.${ChatMessage.className}-header-date`;
  }

  static get selectorAuthor() {
    return `.${ChatMessage.className}-header-author`;
  }

  static get selectorContent() {
    return `.${ChatMessage.className}-content`;
  }

  constructor(author, message, date, isUser = false) {
    this.#isUser = isUser;
    this.container = document.createElement('div');
    this.container.classList.add(ChatMessage.className);
    if (isUser) {
      this.container.classList.add(`${ChatMessage.className}-byuser`);
    }
    this.container.innerHTML = ChatMessage.markup;

    this.elDate = this.container.querySelector(ChatMessage.selectorDate);
    this.elAuthor = this.container.querySelector(ChatMessage.selectorAuthor);
    this.elMessage = this.container.querySelector(ChatMessage.selectorContent);

    this.author = author;
    this.message = message;
    this.date = date;
  }

  get author() { return this.author; }

  set author(author) {
    this.#author = author;
    this.elAuthor.textContent = this.isUser ? 'You' : author;
  }

  get message() { return this.message; }

  set message(message) {
    this.#message = message;
    this.elMessage.textContent = message;
  }

  get date() { return this.date; }

  set date(date) {
    this.#date = date;
    this.elDate.textContent = moment(date).format('HH:MM DD.MM.YYYY');
  }

  get isUser() { return this.#isUser; }

  get htmlElement() {
    return this.container;
  }
}
