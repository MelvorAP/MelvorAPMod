export let lastRecievedItemIndex = -1;

let items = null;
let skillHandler = null;

let characterStorage = null;

export async function setup(ctx, itms){
    items = itms;

    skillHandler = ctx.skillHandler;

    characterStorage = ctx.characterStorage;

    lastRecievedItemIndex = characterStorage.getItem("AP_itemIndex") ?? -1;
}

export function updateItemIndex(newIndex){
    lastRecievedItemIndex = newIndex;
    characterStorage.setItem("AP_itemIndex", newIndex)
}

export function receiveItem(id){
    const itemName = items.itemDict.get(id);

    if(items.skills.find(x => x == itemName)){
        skillHandler.unlockSkill(itemName);
    }
    else if(items.pets.find(x => x == itemName)){
        unlockPet(itemName);
    }
    else{
        console.error("Unimplemented item: " + itemName);
        return false;
    }
      return true;
  }

function unlockPet(petName){
    game.petManager.unlockPetByID(petName)
}