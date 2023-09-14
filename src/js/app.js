import ChatController from './ChatController';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const chatController = new ChatController(container);
  chatController.init();
});
