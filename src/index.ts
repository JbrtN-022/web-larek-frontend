import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiService } from './components/ApiService';
import { DataModel } from './components/Model/AppData';
import { Card } from './components/View/Card';
import { CardPreview } from './components/Presenter';
import { IOrderLots, IOrderForms, IProductItems } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/Basket';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/Form';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';
import { Page } from './components/View/Page';
// Шаблоны
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
  //ensureElement<HTMLTemplateElement>('#success'),
};

// Основные модели и компоненты
const apiService = new ApiService(CDN_URL, API_URL);
const events = new EventEmitter();
const page = new Page();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketModel = new BasketModel();
const basket = new Basket(templates.basket, events);
const formModel = new FormModel(events);
const order = new Order(templates.order, events);
const contacts = new Contacts(templates.contacts, events);


function renderProductCards() {
  dataModel.productCards.forEach((item) => {
    console.log(item.category)
    const card = new Card(templates.cardCatalog, events, { onClick: () => events.emit('card:select', item) });
    page.gallery.append(card.render(item));
  });
}

function renderBasketItems() {
  let index = 0;
  basket.items = basketModel.basketProducts.map((item) => {
    const basketItem = new BasketItem(templates.cardBasket, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    return basketItem.render(item, ++index);
  });
}

// Слушатели событий
events.on('productCards:receive', renderProductCards);

events.on('card:select', (item: IProductItems) => dataModel.setPreview(item));

events.on('modalCard:open', (item: IProductItems) => {
  const cardPreview = new CardPreview(templates.cardPreview, events);
  modal.content = cardPreview.render(item);
  modal.render();
});

events.on('basket:toggleItem', (item: IProductItems) => {
  const existsInBasket = basketModel.basketProducts.some((product) => product.id === item.id);

  if (existsInBasket) {
    basketModel.deleteCardToBasket(item);
  } else {
    basketModel.setSelectedСard(item);
  }

  basket.renderHeaderBasketCounter(basketModel.getCounter());
  renderBasketItems();
});

events.on('card:addBasket', () => {
  events.emit('basket:toggleItem', dataModel.selectedСard);
  modal.close();
});

events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  renderBasketItems();
  modal.content = basket.render();
  modal.render();

  formModel.items = basketModel.basketProducts.map(product => product.id);
  console.log('Обновленный formModel.items:', formModel.items);

  //apiService.postOrderLot(formModel.getOrderLot())
});

events.on('basket:basketItemRemove', (item: IProductItems) => {
  basketModel.deleteCardToBasket(item);
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  renderBasketItems();

});

events.on('order:open', () => {
  modal.content = order.render();
  modal.render();

});

events.on('order:changeAddress', (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.value);
})

events.on('order:changeEmail', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

// Обновление Телефона
events.on('order:changePhone', (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.payment = button.name; // Устанавливаем способ оплаты
  
  console.log("Выбран способ оплаты:", formModel.payment);
  console.log("Текущий адрес:", formModel.address);
  console.log("Текущий email:", formModel.email);
  console.log("Текущий телефон:", formModel.phone);

  // Проверяем, заполнены ли все обязательные поля перед валидацией
  if (formModel.address && formModel.email && formModel.phone) {
    formModel.validateOrder();
  } else {
    console.warn("Не все данные введены, ждем заполнения.");
  }
});


events.on('formErrors:address', (errors: Partial<IOrderForms>) => {
  const { address, payment } = errors; // Теперь TypeScript знает, что у errors есть address и payment
  order.valid = !address && !payment; // Устанавливаем валидность формы
  order.formErrors.textContent = Object.values(errors)
    .filter(Boolean)
    .join('; '); // Сообщения об ошибках, разделенные точкой с запятой
});

events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();
  modal.content = contacts.render();
  modal.render();
});

events.on('contacts:changeInput', (data: { field: string, value: string }) => formModel.setOrderData(data.field, data.value));

events.on('formErrors:change', (errors: Partial<IOrderForms>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({ email, phone }).filter(Boolean).join('; ');
});

// не понимаю, проблема во мне или в сети в консоли выводятся все ошибки и процессы которые происходят после нажатия кнопки для открытия 
//success массив данных сохраняется правильно так же как и цена 
events.on('success:open', () => {
  // Проверяем, указан ли способ оплаты
  if (!formModel.payment) {
    console.error("Ошибка: Способ оплаты не выбран!");
    events.emit('error:notification', { message: 'Выберите способ оплаты перед оформлением заказа.' });
    return; 
  }

  // Обновляем formModel.items перед отправкой
  formModel.items = basketModel.basketProducts.map(product => product.id);
  console.log('Финальный заказ перед отправкой:', formModel.getOrderLot());

  apiService.postOrderLot(formModel.getOrderLot())
    .then(() => {
      const success = new Success(templates.success, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      modal.render();
    })
    .catch((error) => {
      console.error('Ошибка при отправке данных заказа:', error);
      events.emit('error:notification', { message: 'Не удалось оформить заказ. Пожалуйста, попробуйте снова.' });
    });
});


// Обработка события закрытия успешной оплаты (очистка корзины и закрытие окна)
events.on('success:close', () => {
  basketModel.clearBasketProducts();
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  modal.close();
});
events.on('modal:open', () => page.locked = true); // Управляем блокировкой скролла через Page
events.on('modal:close', () => page.locked = false);

// Загрузка данных
apiService.getListProductCard()
  .then((data: IProductItems[]) => { dataModel.productCards = data; })
  .catch(console.error);
