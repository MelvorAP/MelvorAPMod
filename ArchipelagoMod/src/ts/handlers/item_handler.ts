import { Items } from "../data/items";
import { SkillHandler } from "./skills/skill_handler";
import { SlotdataHandler } from "./slotdata_handler";

export class ItemHandler{
    public lastRecievedItemIndex : number = -1;

    public items : Items;

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

        console.log(`New recieved item index is ${newIndex}`);
    }

    receiveItemByName(name : string){
        this.items.itemDict.forEach((value: string, id: number) => {
            if(value === name){
                this.receiveItem(id);
                return;
            }
        });
    }

    receiveItem(id : number){
        const itemID = this.items.itemDict.get(id)!;
        console.log(`Received item ${itemID} (${id})`)
        
        if(this.items.skills.find(x => x == itemID) && !this.slotdataHandler.apSettings.progressiveSkills){
            //this.skillHandler.progressSkill(itemID);
        }
        else if(this.items.progressive_skills.has(id) && this.slotdataHandler.apSettings.progressiveSkills){
            this.skillHandler.progressSkill(this.items.progressive_skills.get(id) ?? "UNKNOWN");
        }
        else if(this.items.demo_skill_level_caps.find(x => x == itemID)){
            this.skillHandler.increaseCap(this.items.skill_caps.get(id) ?? "UNKNOWN");
        }
        else if(this.items.pets.find(x => x == itemID)){
            this.unlockPet(itemID);
        }
        else if(this.items.demo_extra_unlocks.find(x => x == itemID) === "Shop Unlock"){
            this.characterStorage.setItem(Items.otherSavePrefix + "Shop_Unlock", 1)
        }
        else if(this.items.demo_extra_unlocks.find(x => x == itemID) === "Bank Unlock"){
            this.characterStorage.setItem(Items.otherSavePrefix + "Bank_Unlock", 1)
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

        
    hasShop(){
        return this.characterStorage.getItem(Items.otherSavePrefix + "Shop_Unlock")
    }
}
