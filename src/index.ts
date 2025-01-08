import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiClient';
import { DataModel } from './components/Model/AppData';
import { Card } from './components/View/Card';
import { CardPreview } from './components/Presenter';
import { IOrderForms, IProductItems } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/Basket';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/Form';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

// Шаблоны
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
};

// Основные модели и компоненты
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketModel = new BasketModel();
const basket = new Basket(templates.basket, events);
const formModel = new FormModel(events);
const order = new Order(templates.order, events);
const contacts = new Contacts(templates.contacts, events);

// Функции для упрощения кода
function renderProductCards() {
  dataModel.productCards.forEach((item) => {
    const card = new Card(templates.cardCatalog, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
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

events.on('card:addBasket', () => {
  basketModel.setSelectedСard(dataModel.selectedСard);
  basket.renderHeaderBasketCounter(basketModel.getCounter());
  modal.close();
});

events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.getSumAllProducts());
  renderBasketItems();
  modal.content = basket.render();
  modal.render();
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
  formModel.items = basketModel.basketProducts.map((item) => item.id);
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => formModel.payment = button.name);

events.on('order:changeAddress', (data: { field: string, value: string }) => formModel.setOrderAddress(data.field, data.value));

events.on('formErrors:address', (errors: Partial<IOrderForms>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({ address, payment }).filter(Boolean).join('; ');
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

events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot())
    .then(() => {
      const success = new Success(templates.success, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts();
      basket.renderHeaderBasketCounter(basketModel.getCounter());
      modal.render();
    })
    .catch(console.error);
});

events.on('success:close', () => modal.close());

events.on('modal:open', () => modal.locked = true);
events.on('modal:close', () => modal.locked = false);

// Загрузка данных
apiModel.getListProductCard()
  .then((data: IProductItems[]) => { dataModel.productCards = data; })
  .catch(console.error);
