import { IProductItems } from "../../types";
import { IEvents } from "../base/events";

export interface IDataModel {
  productCards: IProductItems[];
  selectedСard: IProductItems;
  setPreview(item: IProductItems): void;
}

export class DataModel implements IDataModel {
  protected _productCards: IProductItems[];
  selectedСard: IProductItems;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: IProductItems[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: IProductItems) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}