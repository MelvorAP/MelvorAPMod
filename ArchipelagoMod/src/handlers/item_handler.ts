const { loadModule } = mod.getContext(import.meta);

const { Items } = await loadModule("src/ts/data/items.js");
const { SkillHandler } = await loadModule("src/ts/data/skill_handler.js");

export class ItemHandler{
    lastRecievedItemIndex : number = -1;

    items : Items;

    private skillHandler : SkillHandler;
    private characterStorage : ModStorage;

    constructor(skillHandler: SkillHandler, characterStorage : ModStorage){
        this.items = new Items();

        this.skillHandler = skillHandler;

        this.characterStorage = characterStorage;

        this.lastRecievedItemIndex = characterStorage.getItem("AP_itemIndex") ?? -1;
    }

    updateItemIndex(newIndex : number){
        this.lastRecievedItemIndex = newIndex;
        this.characterStorage.setItem("AP_itemIndex", newIndex)
    }

    receiveItem(id : Number){
        const itemName = this.items.itemDict.get(id);

        if(this.items.skills.find(x => x == itemName)){
            this.skillHandler.unlockSkill(itemName);
        }
        else if(this.items.pets.find(x => x == itemName)){
            this.unlockPet(itemName);
        }
        else{
            console.error("Unimplemented item: " + itemName);
            return false;
        }
        return true;
    }

    unlockPet(petName : string){
        game.petManager.unlockPetByID(petName)
    }
}
