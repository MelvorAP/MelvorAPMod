import { Items } from "../data/items";
import { SkillHandler } from "./skill_handler";

export class ItemHandler{
    lastRecievedItemIndex : number = -1;

    items : Items;

    private skillHandler : SkillHandler;
    private characterStorage : ModStorage;

    constructor(skillHandler: SkillHandler){
        this.items = new Items();

        this.skillHandler = skillHandler;

        this.characterStorage = {} as ModStorage; 
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.lastRecievedItemIndex = this.characterStorage.getItem("AP_itemIndex") ?? -1;
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
