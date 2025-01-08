export interface IProductItems {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
  
  export interface IActions {
    onClick: (event: MouseEvent) => void;
  }
  
  // интерфейс формы заказа
  export interface IOrderForms {
  payment?: string;
  address?: string;
  phone?: string;
  email?: string;
  total?: string | number;
  }
  
  export interface IOrder extends IOrderForms {
    items: string[];
  }
  
  export interface IOrderLots{
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
  }
  
  export interface IOrderResult {
    id: string;
    total: number;
  }
  
  // тип ошибки формы
  export type FormErrors = Partial<Record<keyof IOrder, string>>;



/*  export interface ISuccess {
    close: HTMLButtonElement;
    description: HTMLSpanElement;
    total: number;
  }
  
  export interface ISuccessActions {
    onClick: () => void;
  }
  
  export interface IBasket {
    items: CardBasket[];
    total: number | null;
  }
  
  export type CardBasket = Pick<ICard, 'id' | 'title' | 'price'>;*/