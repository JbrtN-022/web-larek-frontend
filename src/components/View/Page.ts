export class Page {
    public gallery: HTMLElement;
    private basketButton: HTMLButtonElement;
    private _pageWrapper: HTMLElement;
  
    constructor() {
      this.gallery = document.querySelector('.gallery');
      this.basketButton = document.querySelector('.basket__button');
      this._pageWrapper = document.querySelector('.page__wrapper');
    }
  
    // Сеттер для блокировки/разблокировки скролла страницы
    set locked(value: boolean) {
      if (value) {
        this._pageWrapper.classList.add('page__wrapper_locked');
      } else {
        this._pageWrapper.classList.remove('page__wrapper_locked');
      }
    }
  
    // Метод получения элемента галереи
    getGallery(): HTMLElement {
      return this.gallery;
    }
  
    // Метод получения кнопки корзины
    getBasketButton(): HTMLButtonElement {
      return this.basketButton;
    }
  }
  
  