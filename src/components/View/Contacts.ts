import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Contacts extends Form {
  private inputAll: HTMLInputElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.inputAll = Array.from(this.formElement.querySelectorAll('.form__input'));
    this.inputAll.forEach((input) => {
      input.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name;
        const value = target.value;
        this.events.emit('contacts:changeInput', { field, value });
      });
    });
  }

  protected handleSubmit(): void {
    this.events.emit('success:open');
  }
}