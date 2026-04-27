import { APRequirement } from "../../../ap_classes/ap_requirement";
import { ItemHandler } from "../../item_handler";
import { CombatUnlockHandler } from "../combat_unlock_handler";

export const CombatRequirementType = "CombatRequirement";

export interface CombatRequirementData {
  type: string,
  itemId: string, 
  itemType: string, 
  savePrefix: string,
  iconUrl: string,

  combatUnlockHandler: CombatUnlockHandler
}

// @ts-ignore
export class CombatRequirement extends APRequirement {
  savePrefix : string;

  private combatUnlockHandler : CombatUnlockHandler;

  constructor(data : CombatRequirementData, game : Game) {
    super(game, data.type, data.itemId, data.itemType, data.iconUrl);

    this.savePrefix = data.savePrefix;

    this.combatUnlockHandler = data.combatUnlockHandler;
  }

  isMet() {
    return this.combatUnlockHandler.hasAnyCombat() && this.combatUnlockHandler.isAreaUnlocked(this.savePrefix, this.itemId);
  }
}