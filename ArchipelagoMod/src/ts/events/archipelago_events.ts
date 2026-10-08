import { ItemType } from "../data/items";

export class ArchipelagoItemReceivedEvent extends GameEvent {
    itemId: number;
    itemType : ItemType
    
    constructor(itemId : number, itemType : ItemType) {
      super ();
      this.itemId = itemId;
      this.itemType = itemType;
    }
  }

  export class SkillItemReceivedEvent extends ArchipelagoItemReceivedEvent {
    skillId : string;
    
    constructor(itemId : number, itemType : ItemType, skillId : string) {
      super (itemId, itemType);
      this.skillId = skillId;
    }
  }