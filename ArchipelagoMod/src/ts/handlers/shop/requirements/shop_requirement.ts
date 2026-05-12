import { APRequirement } from "../../../ap_classes/ap_requirement";
import { ShopHandler } from "../shop_handler";

export const ShopRequirementType = "ShopRequirement";

export interface ShopRequirementData {
  type: string,
  itemId: string, 
  itemType: string, 
  iconUrl: string,

  shopUnlockHandler: ShopHandler
}

// @ts-ignore
export class ShopRequirement extends APRequirement {
  private shopUnlockHandler : ShopHandler;

  constructor(data : ShopRequirementData, game : Game) {
    super(game, data.type, data.itemId, data.itemType, data.iconUrl);

    this.shopUnlockHandler = data.shopUnlockHandler;
  }

  isMet() {
    return false;
  }
}