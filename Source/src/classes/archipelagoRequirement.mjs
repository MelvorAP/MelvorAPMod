export class ArchipelagoRequirement extends GameRequirement {
  constructor(data, game) {
    super (game);
    this.type = 'ArchipelagoUnlock';
    this.itemId = data.itemId;
    this.itemType = data.itemType;
  }
  isMet() {
    return game.test;
  }
  notifyFailure() {
    const templateData = {
      dungeonName: this.dungeon.name,
      count: `${ this.count }`,
    };
    if (this.count > 1) {
      notifyPlayer(
        this.game.attack,
        templateLangString('TOASTS_DUNGEON_COMPLETION_REEQUIRED_MULTIPLE', templateData)
      );
    } 
    else {
      notifyPlayer(
        this.game.attack,
        templateLangString('TOASTS_DUNGEON_COMPLETION_REQUIRED_ONCE', templateData)
      );
    }
  }
  getHandler(callback) {
    return (e) => {
      if (e.itemId === this.itemId){
        callback(e);
      }
    };
  }
  _assignHandler(handler) {
    this.game.completion.on('ApItemsChangedEvent', handler);
  }
  _unassignHandler(handler) {
    this.game.completion.off('ApItemsChangedEvent', handler);
  }
  getNodes(imageClass) {
    return ` Find this ${this.itemType} in the AP World!`;
  }
}