import { ShopHandler } from "./shop_handler";

// @ts-ignore
export class ApShopPurchase extends ShopPurchase {
  private shopHandler : ShopHandler;
  private shopId : number;

  constructor(shopId : number, namespace : DataNamespace, data : ShopPurchaseData, game : Game, shopHandler : ShopHandler) {
    super(namespace, data, game);

    this.shopHandler = shopHandler;
    this.shopId = shopId;
  }

  sendLocation() {
    this.shopHandler.purchase(this.shopId);
  }
}