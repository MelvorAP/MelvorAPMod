import { Items } from "../data/items";
import { NotificationHandler } from "../handlers/notification_handler";
import { ActionHandler } from "../handlers/skills/action_handler";
import { SkillHandler } from "../handlers/skills/skill_handler";

export interface ApRequirementData {
  type: string, 
  itemId: string, 
  itemType: string,
  skillId: string,
  isProgressive: boolean,
  countNeeded: number,
  items: Items,
  actionHandler: ActionHandler,
  skillHandler: SkillHandler,
  notificationHandler: NotificationHandler,
  iconUrl: string
}

// @ts-ignore
export class ArchipelagoRequirement extends GameRequirement {
    type: string;
    itemId: string;
    itemType: string;
    skillId: string;
    isProgressive: boolean;
    countNeeded: number;
    iconUrl: string;

    items: Items;
    skillHandler: SkillHandler;
    actionHandler: ActionHandler;
    notificationHandler: NotificationHandler;

  constructor(data : ApRequirementData, game : Game) {
    super (game);

    this.type = 'ArchipelagoUnlock';
    this.itemId = data.itemId;
    this.itemType = data.itemType;
    this.skillId = data.skillId;

    this.isProgressive = data.isProgressive;
    this.countNeeded = data.countNeeded;

    this.iconUrl = data.iconUrl;

    this.items = data.items;
    this.skillHandler = data.skillHandler;
    this.actionHandler = data.actionHandler;
    this.notificationHandler = data.notificationHandler;
  }

  isMet() {
    if(this.items.skills.includes(this.skillId) && this.isProgressive){
      let unlocked = this.skillHandler.getProgressiveSkillCount(this.skillId) >= this.countNeeded;
      //console.log("Is progresive and unlocked:",unlocked);
      return unlocked;
    }
    else if (this.items.skill_actions.get(this.skillId)?.includes(this.itemId) && !this.isProgressive){
      //console.log("Is not progresive and unlocked:")
      return this.actionHandler.isActionUnlocked(this.itemId);
    }
    else{
      console.warn("Unknown type for requirement of", this.itemId);
    }

    return false;
  }

  notifyFailure() {
    this.notificationHandler.showApModal("This", "a")
  }

  // @ts-ignore
  getHandler(callback) {
    return (e : any) => {
      if (e.itemId === this.itemId){
        callback(e);
      }
      else{
        console.log();
      }
    };
  }

  // @ts-ignore
  _assignHandler(handler) {
    // @ts-ignore
    game.completion.on('apItemsChangedEvent', handler);
  }

  // @ts-ignore
  _unassignHandler(handler) {
    // @ts-ignore
    game.completion.off('apItemsChangedEvent', handler);
  }

  getNodes(imageClass : any) {
    // @ts-ignore
    return templateStringWithNodes('Find this ${itemType} in the ${apImage}AP world to unlock it.', { apImage: this.createImage(this.iconUrl, imageClass) }, {itemType: this.itemType}, false);
  }
}