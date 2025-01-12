
import { IOrderLots, IOrderResult, IProductItems } from '../../types';

export interface IApiModel {
  cdn: string;
  items: IProductItems[];
  getListProductCard: () => Promise<IProductItems[]>;
  postOrderLot: (order: IOrderLots) => Promise<IOrderResult>;
}

