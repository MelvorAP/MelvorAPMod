import { APRequirement } from "../../../ap_classes/ap_requirement";
import { Items } from "../../../data/items";
import { BaseSkillHandler } from "../base_skill_handler";

export interface ProgressiveRequirementData {
  itemId: string, 
  itemType: string,
  skillId: string,
  countNeeded: number,
  iconUrl: string,

  actionHandler: BaseSkillHandler
}

// @ts-ignore
export class ProgressiveSkillRequirement extends APRequirement {
    skillId: string;
    countNeeded: number;

    private actionHandler: BaseSkillHandler;

  constructor(data : ProgressiveRequirementData, game : Game) {
    super (game, data.itemId, data.itemType, data.iconUrl);

    this.skillId = data.skillId;

    this.countNeeded = data.countNeeded;
    this.actionHandler = data.actionHandler;
  }

  isMet() {
    if(game.skills.getObjectByID(this.skillId)){
      let unlocked = this.actionHandler.getProgressiveSkillCount() >= this.countNeeded;
      //console.log("Is progresive and unlocked:",unlocked);
      return unlocked;
    }
    else{
      console.warn("Unknown type for requirement of", this.itemId);
    }

    return false;
  }
}