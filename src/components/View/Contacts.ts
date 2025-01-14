import { IEvents } from "../base/events";
import { Form } from "./Form";

export class Contacts extends Form {
  private buttonAll: HTMLInputElement[];
  private submitButton: HTMLButtonElement; // Кнопка оформления заказа

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.buttonAll = Array.from(this.formElement.querySelectorAll('.button_alt'));
    this.submitButton = this.formElement.querySelector('.order__button'); // Инициализация кнопки
    if (!this.submitButton) {
      console.error('Submit button not found in the form.');
    }

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
    
     if (field === 'phone' || field === 'email') {
        const eventName = field === 'phone' ? 'order:changePhone' : 'order:changeEmail';
        this.events.emit(eventName, { field, value });
      } else {
        console.warn(`Unhandled input field: ${field}`);
      }
    });

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
        this.submitButton.disabled = !isValid;
        this.submitButton.classList.toggle('button_alt-active', isValid);
      }
    protected handleSubmit(): void {
    this.events.emit('success:open');
  }

  set paymentSelection(paymentMethod: string) {
    if (!this.buttonAll.length) {
      console.warn('Кнопки для выбора способа оплаты не найдены2.');
      return;
    }
    this.buttonAll.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === paymentMethod);
    });
  }
}
  

 
  
