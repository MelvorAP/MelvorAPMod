let items = null;
let characterStorage = null;

const skillSavePrefix = "Skill_"

export let lastRecievedItemIndex = -1;

export async function setup(ctx){
    characterStorage = ctx.characterStorage;

    items = await ctx.loadModule('src/data/items.mjs');
    items.setup();

    lastRecievedItemIndex = characterStorage.getItem("AP_itemIndex") ?? -1;
}

export function updateItemIndex(newIndex){
    lastRecievedItemIndex = newIndex;
    characterStorage.setItem("AP_itemIndex", newIndex)
}

export function lockSkills(){
    const skills = game.skills.registeredObjects;
    const iterator = skills.values();

    game.skills.registeredObjects.values().next().value;

    for(let i = 0; i < skills.size; i++){
        let skill = iterator.next().value;
        skill.setUnlock(false);
    }
}

export function loadUnlockedSkills(){
    const iterator = items.itemDict.entries();

    for(let i = 0; i < items.itemDict.size; i++){
        const v = iterator.next().value;

        const itemId = v[0];
        const itemName = v[1];

        const saveCount = characterStorage.getItem(skillSavePrefix + itemName)

        if(saveCount){
            for(let i = 0; i < saveCount; i++){
                receiveItem(itemId);
            }
        }
    }
}

export function receiveItem(id){
    const itemName = items.itemDict.get(id);

    if(items.skillArr.find(x => x == itemName)){
        unlockSkill(itemName);
    }
    else if(items.petArr.find(x => x == itemName)){
        unlockPet(itemName);
    }
    else{
        console.error("Unimplemented item: " + itemName);
        return false;
    }
      return true;
  }
  
function unlockSkill(skillName){
    game.skills.getObjectByID(skillName).setUnlock(true);
    characterStorage.setItem(skillSavePrefix + skillName, 1);
}

function unlockPet(petName){
    game.petManager.unlockPetByID(petName)
}