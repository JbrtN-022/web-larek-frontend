import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Order extends Form {
  private buttonAll: HTMLButtonElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.buttonAll = Array.from(this.formElement.querySelectorAll('.button_alt'));
    this.buttonAll.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentSelection = button.name;
        this.events.emit('order:paymentSelection', button);
      });
    });

    this.formElement.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit('order:changeAddress', { field, value });
    });
  }

  protected handleSubmit(): void {
    this.events.emit('contacts:open');
  }

  // Установка активного метода оплаты
  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === paymentMethod);
    });
  }
}
