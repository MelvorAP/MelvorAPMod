class ArchipelagoItemsChangedEvent extends GameEvent {
    constructor(namespace, newItem) {
      super ();
      this.namespace = namespace;
      this.newItem = newItem;
    }
  }