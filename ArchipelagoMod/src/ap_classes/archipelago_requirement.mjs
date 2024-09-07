export class ArchipelagoRequirement extends GameRequirement {
  constructor(data, game) {
    super (game);

    this.type = 'ArchipelagoUnlock';
    this.itemId = data.itemId;
    this.itemType = data.itemType;

    this.isProgressive = data.isProgressive;
    this.countNeeded = data.countNeeded;

    this.items = data.items;
    this.skillHandler = data.skillHandler;
    this.iconUrl = data.iconUrl;
  }

  isMet() {
    if(this.items.skillActions.includes(itemId)){
      if(isProgressive){
        return this.skillHandler.getProgressiveSkillCount(itemId) >= countNeeded;
      }
      else{
        return this.skillHandler.isActionUnlocked(itemId);
      }
    }
    else{
      console.warn("Unknown type for requirement", itemId);
    }

    return false;
  }

  notifyFailure() {
    notificationHandler.showApModal("This")
  }

  getHandler(callback) {
    return (e) => {
      if (e.itemId === this.itemId){
        callback(e);
      }
    };
  }

  _assignHandler(handler) {
    this.game.completion.on('apItemsChangedEvent', handler);
  }

  _unassignHandler(handler) {
    this.game.completion.off('apItemsChangedEvent', handler);
  }

  getNodes(imageClass) {
    return ` Find this ${this.itemType} in the ${this.createImage(this.iconUrl, imageClass)}AP World!`;
  }
}