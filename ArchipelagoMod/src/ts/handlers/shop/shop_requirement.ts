import { APRequirement } from "../../ap_classes/ap_requirement";
import { ShopHandler } from "./shop_handler";

export const ShopPurchaseRequirementType = "ShopPurchaseRequirement";
export const ShopUnlockRequirementType = "ShopUnlockRequirement";

export interface ShopPurchaseRequirementData {
  type: string,
  itemId: string, 
  itemType: string, 
  iconUrl: string,

  shopUnlockHandler: ShopHandler
}

export interface ShopUnlockRequirementData {
  type: string,
  itemId: string, 
  itemType: string, 
  iconUrl: string,

  shopUnlockHandler: ShopHandler
}

// @ts-ignore
export class ShopPurchaseRequirement extends APRequirement {
  private shopUnlockHandler : ShopHandler;

  constructor(data : ShopPurchaseRequirementData, game : Game) {
    super(game, data.type, data.itemId, data.itemType, data.iconUrl);

    this.shopUnlockHandler = data.shopUnlockHandler;
    this.check = super.check;
  }

  isMet() {
    return false;
  }
}

// @ts-ignore
export class ShopUnlockRequirement extends APRequirement {
  private shopUnlockHandler : ShopHandler;
  purchase = undefined;

  constructor(data : ShopUnlockRequirementData, game : Game) {
    super(game, data.type, data.itemId, data.itemType, data.iconUrl);

    this.shopUnlockHandler = data.shopUnlockHandler;
    this.check = super.check;
  }

  isMet() {
    return false;
  }
}