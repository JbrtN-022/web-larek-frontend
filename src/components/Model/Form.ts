import { IEvents } from '../base/events';
import { FormErrors } from '../../types/index'

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderData(field: string, value: string): void
  validateContacts(): boolean;
  getOrderLot(): object;
}

export class FormModel implements IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

 // Не понимаю почему кнопка 'далее' остается не активной хотя я проверяю заполнены ли все поля и если это так то даю класс button_alt-active

  // принимаем значение строки "address"

  setOrderAddress(value: string) {
    this.address = value;
    console.log('Address updated:', value);
    this.updateFormState();
  }

  isValid(): boolean {

    return !!this.address || !!this.email && !!this.phone || !!this.payment;
  }
  
  
  updateFormState() {
    const isValid = this.isValid();
    console.log('Form valid state:', isValid);
    this.events.emit('form:stateChange', { isValid });
  }



  // валидация данных строки "address"
  validateOrder() {
    const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
    const errors: typeof this.formErrors = {};

    if (!this.address) {
      errors.address = 'Необходимо указать адрес'
    } else if (!regexp.test(this.address)) {
      errors.address = 'Укажите настоящий адрес'
    } 

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    console.log('Current address:', this.address);
    console.log('Current payment:', this.payment);
    console.log('Validation errors:', errors);

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // принимаем значение данных строк "Email" и "Телефон"
  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
      console.log(`Email updated: ${value}`);
    } else if (field === 'phone') {
      this.phone = value;
    }


    
    console.log('Current form data:', {
      email: this.email,
      phone: this.phone,
      address: this.address,
      payment: this.payment,
      total: this.total,
      items: this.items,
    });

    this.updateFormState();

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
    
  }

  // Валидация данных строк "Email" и "Телефон"
  validateContacts() {
    const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email'
    } else if (!regexpEmail.test(this.email)) {
      errors.email = 'Некорректный адрес электронной почты'
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    console.log(`Phone updated: ${this.phone}`); 
  

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон'
    } else if (!regexpPhone.test(this.phone)) {
      errors.phone = 'Некорректный формат номера телефона'
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  
  getOrderLot() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
  }
}


/*updateFormState() {
    const isValid = this.isValid();
  
  // Получаем кнопку оформления заказа
  const submitButton = document.querySelector<HTMLButtonElement>('.order__submit');
  
  if (submitButton) {
    // Активируем или деактивируем кнопку
    submitButton.disabled = !isValid;

    // Меняем стиль кнопки, добавляя/удаляя класс для активного состояния
    if (isValid) {
      submitButton.classList.add('button_alt-active'); // Активный стиль
    } else {
      submitButton.classList.remove('button_alt-active'); // Обычный стиль
    }
  }

  // Уведомляем всех подписчиков о состоянии формы
  this.events.emit('form:stateChange', { isValid });
  }*/

  /*setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }*/