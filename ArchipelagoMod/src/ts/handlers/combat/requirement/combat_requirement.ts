import { APRequirement } from "../../../ap_classes/ap_requirement";
import { ItemHandler } from "../../item_handler";

export const CombatRequirementType = "CombatRequirement";

export interface CombatRequirementData {
  type: string,
  itemId: string, 
  itemType: string, 
  savePrefix: string,
  iconUrl: string,

  itemHandler: ItemHandler,
  characterStorage : ModStorage
}

// @ts-ignore
export class CombatRequirement extends APRequirement {
  savePrefix : string;

  private itemHandler : ItemHandler;
  private characterStorage : ModStorage;

  constructor(data : CombatRequirementData, game : Game) {
    super(game, data.type, data.itemId, data.itemType, data.iconUrl);

    this.savePrefix = data.savePrefix;

    this.itemHandler = data.itemHandler;
    this.characterStorage = data.characterStorage;
  }

  isMet() {
    return this.itemHandler.hasAnyCombat() && this.characterStorage.getItem(this.savePrefix + this.itemId) as boolean;
  }
}