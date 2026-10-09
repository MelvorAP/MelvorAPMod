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

export class PetReceivedEvent extends ArchipelagoItemReceivedEvent {
    petId : string;
    
    constructor(itemId : number, itemType : ItemType, petId : string) {
      super (itemId, itemType);
      this.petId = petId;
    }
  }

export class CombatAreaUnlockedEvent extends ArchipelagoItemReceivedEvent {
    areaId : string;
    
    constructor(itemId : number, itemType : ItemType, areaId : string) {
      super (itemId, itemType);
      this.areaId = areaId;
    }
  }