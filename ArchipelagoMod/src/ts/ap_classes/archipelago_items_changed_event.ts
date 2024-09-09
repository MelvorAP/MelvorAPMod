export class ArchipelagoItemsChangedEvent extends GameEvent {
    itemId: string;
    
    constructor(itemId : string) {
      super ();
      this.itemId = itemId;
    }
  }