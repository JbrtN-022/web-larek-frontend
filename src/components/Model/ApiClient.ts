import { ApiListResponse, Api } from '../base/api'
import { IOrderLots, IOrderResult, IProductItems } from '../../types';

export interface IApiModel {
  cdn: string;
  items: IProductItems[];
  getListProductCard: () => Promise<IProductItems[]>;
  postOrderLot: (order: IOrderLots) => Promise<IOrderResult>;
}

export class ApiModel extends Api {
  cdn: string;
  items: IProductItems[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // получаем массив объектов(карточек) с сервера
  getListProductCard(): Promise<IProductItems[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItems>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // получаем ответ от сервера по сделанному заказу
  postOrderLot(order: IOrderLots): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}