export default class Modal {
  static inputTextDialog(title, text = '', yesBtnText = 'Продолжить') {
    const container = document.createElement('div');
    container.classList.add('modal-container');
    container.innerHTML = `
      <div class="modal">
        <h2 class="modal-title">${title}</h2>
        <input required class="modal-input" value="${text}" type="text">
        <div class="modal-controls">
          <button class="modal-controls-confirm">${yesBtnText}</button>
        </div>
      </div>
    `;
    const inputEl = container.querySelector('.modal-input');
    const confirmButton = container.querySelector('.modal-controls-confirm');
    return new Promise((resolve) => {
      confirmButton.addEventListener('click', () => {
        container.remove();
        resolve(inputEl.value);
      });
      document.body.appendChild(container);
      inputEl.focus();
    });
  }

  static showError(error) {
    const container = document.createElement('div');
    container.classList.add('modal-container', 'modal-error');
    container.innerHTML = `
      <div class="modal modal-error">
        <h2 class="modal-title">Ошибка</h2>
        <div class="modal-body">${error}</div>
        <div class="modal-controls">
          <button class="modal-controls-confirm">Ok</button>
        </div>
      </div>
    `;
    const confirmButton = container.querySelector('.modal-controls-confirm');
    return new Promise((resolve) => {
      confirmButton.addEventListener('click', () => {
        container.remove();
        resolve();
      });
      document.body.appendChild(container);
    });
  }
}
