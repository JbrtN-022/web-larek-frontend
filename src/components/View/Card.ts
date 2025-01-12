import { IActions, IProductItems } from "../../types";
import { IEvents } from "../base/events";

export interface ICard {
  render(data: IProductItems): HTMLElement;
}
const colors = new Map([
  ['софт-скил', 'card__category_soft'],
  ['хард-скил', 'card__category_hard'],
  ['другое', 'card__category_other'],
  ['дополнительное', 'card__category_additional'],
  ['кнопка', 'card__category_button'],
]);


export class Card implements ICard {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  /*protected colors = <Record<string, string>>{
    "Дополнительное": "additional",
    "Софт-скил": "soft",
    "Кнопка": "button",
    "Хард-скил": "hard",
    "Другое": "other",
  }*/
  
  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');
    
    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  protected setText(element: HTMLElement, value: unknown): string {
    if (element) {
      return element.textContent = String(value);
    }
  }

  set cardCategory(value: string) {
  this.setText(this._cardCategory, value);
  // Сбрасываем все старые классы и добавляем базовый класс
  this._cardCategory.className = 'card__category'; 
  // Добавляем класс из Map, если он существует
  const colorClass = colors.get(value);
    if (colorClass) {
      this._cardCategory.classList.add(colorClass);
    } else {
      console.warn(`Нет цвета для категории: ${value}`);
    }
  }
  get cardCategory() {
    return this._cardCategory.textContent || '';
  }

  protected setPrice(value: number | null): string {
    if (value === null) {
      return 'бесценно'
    }
    return String(value) + 'синапсов'
  }

  render(data: IProductItems): HTMLElement {
    console.log('Категория:', data.category); // Лог для проверки значения категории
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    return this._cardElement;
  }
}