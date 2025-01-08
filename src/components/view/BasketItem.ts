import { IActions, IProductItems } from "../../types";
import { IEvents } from "../base/events";

export interface IBasketItem {
  basketItem: HTMLElement;
  index: HTMLElement;
  name: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;
  render(data: IProductItems, item: number): HTMLElement;
}

export class BasketItem implements IBasketItem {
  basketItem: HTMLElement;
  index: HTMLElement;
  name: HTMLElement;
  price: HTMLElement;
  buttonDelete: HTMLButtonElement;

  constructor(
    private template: HTMLTemplateElement,
    private events: IEvents,
    private actions?: IActions
  ) {
    this.basketItem = this.cloneTemplate();
    this.index = this.getElement<HTMLElement>('.basket__item-index');
    this.name = this.getElement<HTMLElement>('.card__title');
    this.price = this.getElement<HTMLElement>('.card__price');
    this.buttonDelete = this.getElement<HTMLButtonElement>('.basket__item-delete');

    this.setupDeleteAction();
  }

  /**
   * Клонирует содержимое шаблона и возвращает элемент корзины.
   */
  private cloneTemplate(): HTMLElement {
    const content = this.template.content.querySelector('.basket__item');
    if (!content) {
      throw new Error("Не удалось найти элемент с классом '.basket__item' в шаблоне.");
    }
    return content.cloneNode(true) as HTMLElement;
  }

  /**
   * Находит элемент внутри элемента корзины по селектору.
   */
  private getElement<T extends HTMLElement>(selector: string): T {
    const element = this.basketItem.querySelector(selector);
    if (!element) {
      throw new Error(`Не удалось найти элемент с селектором '${selector}' в шаблоне.`);
    }
    return element as T;
  }

  /**
   * Устанавливает обработчик для кнопки удаления.
   */
  private setupDeleteAction(): void {
    if (this.actions?.onClick) {
      this.buttonDelete.addEventListener('click', this.actions.onClick);
    }
  }

  /**
   * Форматирует цену товара.
   */
  private setPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }

  /**
   * Заполняет данные элемента корзины.
   */
  render(data: IProductItems, item: number): HTMLElement {
    this.index.textContent = String(item);
    this.name.textContent = data.title;
    this.price.textContent = this.setPrice(data.price);
    return this.basketItem;
  }
}
