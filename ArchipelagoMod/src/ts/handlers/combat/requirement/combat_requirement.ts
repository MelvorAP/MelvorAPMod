import { APRequirement } from "../../../ap_classes/ap_requirement";
import { CombatAreaPrefix, Items, SlayerAreaPrefix } from "../../../data/items";
import { ItemHandler } from "../../item_handler";
import { NotificationHandler } from "../../notification_handler";
import { BaseSkillHandler } from "../../skills/base_skill_handler";
import { SkillsHandler } from "../../skills_handler";

export interface CombatRequirementData {
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
    super(game, data.itemId, data.itemType, data.iconUrl);

    this.savePrefix = data.savePrefix;

    this.itemHandler = data.itemHandler;
    this.characterStorage = data.characterStorage;
  }

  isMet() {
    return this.itemHandler.hasAnyCombat() && this.characterStorage.getItem(this.savePrefix + this.itemId) as boolean;
  }
}