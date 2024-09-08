import { Items } from "../data/items";
import { NotificationHandler } from "../handlers/notification_handler";
import { SkillHandler } from "../handlers/skill_handler";

// @ts-ignore
export class ArchipelagoRequirement extends GameRequirement {
    type: string;
    itemId: string;
    itemType: string;
    skillType: string;
    isProgressive: boolean;
    countNeeded: number;
    iconUrl: string;

    items: Items;
    skillHandler: SkillHandler;
    notificationHandler: NotificationHandler;


  constructor(data : any, game : Game) {
    super (game);

    this.type = 'ArchipelagoUnlock';
    this.itemId = data.itemId;
    this.itemType = data.itemType;
    this.skillType = data.skillType;

    this.isProgressive = data.isProgressive;
    this.countNeeded = data.countNeeded;

    this.iconUrl = data.iconUrl;

    this.items = data.items;
    this.skillHandler = data.skillHandler;
    this.notificationHandler = data.notificationHandler;
  }

  isMet() {
    console.log("Checking requirements")
    if(this.items.skillActions.includes(this.itemId)){
      if(this.isProgressive){
        console.log("Is progresive")
        return this.skillHandler.getProgressiveSkillCount(this.itemId) >= this.countNeeded;
      }
      else{
        console.log("Is not progresive")
        return this.skillHandler.isActionUnlocked(this.itemId);
      }
    }
    else{
      console.warn("Unknown type for requirement", this.itemId);
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
    let t = templateStringWithNodes('Find this ${itemType} in the ${apImage}AP world to unlock it.', { apImage: this.createImage(this.iconUrl, imageClass) }, {itemType: this.itemType}, false);
    return t;

    // @ts-ignore
    //return [`Unlock this ${this.itemType} in the ${this.createImage(this.iconUrl, imageClass)}AP world to unlock it.`];

    //return [`<p>Unlock this ${this.itemType} in the <img src="${this.iconUrl}" alt="Archipelago"AP world to unlock it.</p>`];
  }
}