import { ArchipelagoItemsChangedEvent } from "../ap_classes/archipelago_items_changed_event";
import { Items } from "../data/items";
import { SkillHandler } from "./skills/skill_handler";
import { SlotdataHandler } from "./slotdata_handler";

export class ItemHandler{
    lastRecievedItemIndex : number = -1;

    items : Items;

    private skillHandler : SkillHandler;
    private slotdataHandler : SlotdataHandler;

    private characterStorage : ModStorage;

    constructor(items : Items, skillHandler: SkillHandler, slotdataHandler : SlotdataHandler){
        this.items = items;

        this.skillHandler = skillHandler;
        this.slotdataHandler = slotdataHandler;

        this.characterStorage = {} as ModStorage; 
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.lastRecievedItemIndex = this.characterStorage.getItem("AP_itemIndex") ?? -1;
    }

    updateItemIndex(newIndex : number){
        this.characterStorage.setItem("AP_itemIndex", newIndex)

        console.log("New recieved item index is", newIndex);
    }

    receiveItem(id : number){
        const itemID = this.items.itemDict.get(id);
        console.log("recieve item",id, itemID)
        
        if(this.items.skills.find(x => x == itemID) && !this.slotdataHandler.apSettings.progressiveSkills){
            this.skillHandler.progressSkill(itemID);
        }
        else if(this.items.progressiveSkills.has(id) && this.slotdataHandler.apSettings.progressiveSkills){
            let skillName : string = this.items.progressiveSkills.get(id) ?? "";
            this.skillHandler.progressSkill(skillName);
            // @ts-ignore
            game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skillName));

            this.refreshMenus();
        }
        else if(this.items.pets.find(x => x == itemID)){
            this.unlockPet(itemID);
        }
        else{
            console.error("Unimplemented item: ", id, itemID);
            return false;
        }
        return true;
    }

    unlockPet(petName : string){
        game.petManager.unlockPetByID(petName)
    }

    refreshMenus(){
        game.woodcutting.renderQueue.treeUnlocks = true;
    }
}
