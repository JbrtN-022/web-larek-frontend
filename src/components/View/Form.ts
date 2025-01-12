import { IEvents } from "../base/events";

export abstract class Form {
  protected formElement: HTMLFormElement;
  protected buttonSubmit: HTMLButtonElement;
  public formErrors: HTMLElement;
  protected events: IEvents;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.formElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonSubmit = this.formElement.querySelector('.button');
    this.formErrors = this.formElement.querySelector('.form__errors');
    this.events = events;

    this.initializeEvents();
  }

  // Метод для инициализации событий
  private initializeEvents() {
    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  }

  // Метод для обработки сабмита, реализуется в дочерних классах
  protected abstract handleSubmit(): void;

  // Метод для установки состояния кнопки сабмита
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  
  // Метод для отображения формы
  render(): HTMLElement {
    return this.formElement;
  }
}
