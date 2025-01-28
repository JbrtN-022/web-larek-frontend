import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Order extends Form {
  private buttonAll: HTMLButtonElement[];
  private submitButton: HTMLButtonElement; // Кнопка оформления заказа

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.buttonAll = Array.from(this.formElement.querySelectorAll('.button_alt'));
    this.submitButton = this.formElement.querySelector('.order__button'); // Инициализация кнопки

    // Настраиваем методы оплаты
    this.buttonAll.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentSelection = button.name;
        this.events.emit('order:paymentSelection', button);
      });
    });

    // Настраиваем обновление адреса
    this.formElement.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit('order:changeAddress', { field, value });
    });

    // Слушаем изменения состояния формы
    events.on('form:stateChange', ({ isValid }: { isValid: boolean }) => {
      this.updateSubmitButton(isValid);
    });
  }

  // Управление активностью кнопки
  private updateSubmitButton(isValid: boolean) {
    if (!this.submitButton) {
      console.warn('Кнопка отправки не инициализирована.');
      return;
    }
    //if (this.submitButton) {
      this.submitButton.disabled = !isValid;
      //this.submitButton.classList.toggle('button_alt-active', isValid); // Добавляем класс стилей
    //}
  }



  protected handleSubmit(): void {
    this.events.emit('contacts:open');
  }

  // Установка активного метода оплаты
  set paymentSelection(paymentMethod: string) {
    if (!this.buttonAll.length) {
      console.warn('Кнопки для выбора способа оплаты не найдены1.');
      return;
    }
    this.buttonAll.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === paymentMethod);
    });
  }
}

/*export class Order extends Form {
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
  }*/