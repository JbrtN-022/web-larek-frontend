import { IEvents } from "../base/events";

export interface IModal {
  open(): void;
  render(): HTMLElement;
  close(): void;
}

export class Modal implements IModal {
  protected modalContainer: HTMLElement;
  protected _content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    this.modalContainer = modalContainer;
    this.closeButton = modalContainer.querySelector('.modal__close');
    this._content = modalContainer.querySelector('.modal__content');

    this.closeButton.addEventListener('click', () => this.close());
    this.modalContainer.addEventListener('click', () => this.close());
    this.modalContainer
      .querySelector('.modal__container')
      .addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  get isOpen(): boolean {
    return this.modalContainer.classList.contains('modal_active');
  }

  open() {
    if (!this.isOpen) {
      this.modalContainer.classList.add('modal_active');
      this.events.emit('modal:open');
    }
  }

  render(): HTMLElement {
    this.open();
    return this.modalContainer;
  }

  close() {
    if (this.isOpen) {
      this.modalContainer.classList.remove('modal_active');
      this._content.replaceChildren(); // Очищаем содержимое
      this.events.emit('modal:close');
    }
  }
}
