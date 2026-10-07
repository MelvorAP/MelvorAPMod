import { ShopHandler } from "./shop_handler";

// @ts-ignore
export class ApShopPurchase extends ShopPurchase {
  public locationId : number;

  constructor(locationId : number, namespace : DataNamespace, data : ShopPurchaseData, game : Game) {
    super(namespace, data, game);

    this.locationId = locationId;
  }
}