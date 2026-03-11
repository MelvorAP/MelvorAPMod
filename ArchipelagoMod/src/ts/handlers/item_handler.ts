import { Items, ItemType, ItemTypeMult, Namespace, NamespaceMult, OtherSavePrefix } from "../data/items";
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
        this.items.itemDict.forEach((value: [string, string], id: number) => {
            if(value[1] === name){
                this.receiveItem(id);
                return;
            }
        });
    }

    receiveItem(id : number){
        const index = id % 1000;
        id = Math.floor(id/1000);
        const itemType = id % 1000 as ItemType;
        const namespace = Math.floor(id / 1000) as Namespace;
        const namespaceName = Namespace[namespace]

        console.log(index);
        console.log(itemType);
        console.log(namespace);

        if(!namespace){
            console.warn(`${namespace} is not supported in the AP world!`);
            return;
        }

        switch(itemType){
            case ItemType['Skills'] : {
                let namespaceSkills = game.skills.namespaceMaps.get(namespaceName);
                let skill = Array.from( namespaceSkills!.values())[index];
                this.skillHandler.unlockSkill(skill);
                break;
            }
            case ItemType.ProgressiveSkills : {
                let namespaceSkills = game.skills.namespaceMaps.get(namespaceName);
                let skill = Array.from( namespaceSkills!.values())[index];
                this.skillHandler.progressSkill(skill);
                break;
            }
            case ItemType.SkillLevelCaps : {
                let namespaceSkills = game.skills.namespaceMaps.get(namespaceName);
                let skill = Array.from( namespaceSkills!.values())[index];
                this.skillHandler.increaseCap(skill);
                break;
            }
            case ItemType.ActionLevelCaps :
                break;
            case ItemType.Pets : {
                let namespacePets = game.pets.namespaceMaps.get(namespaceName);
                let pet = Array.from( namespacePets!.values())[index];
                this.unlockPet(pet.id);
                break;
            }
            case ItemType.OtherUnlocks : {
                switch(namespace){
                    case Namespace.melvorD :
                        switch(this.items.demo_ap_unlocks[index]){
                            case "Shop Unlock" :
                                this.characterStorage.setItem(OtherSavePrefix + "Shop_Unlock", true);
                                break;
                            case "Bank Unlock" :
                                this.characterStorage.setItem(OtherSavePrefix + "Bank_Unlock", true);
                                break;
                        }
                        break;
                    case Namespace.melvorF :
                        break;
                    default :
                        break;
                }

                break;
            }
            default:
                console.warn(`Unknown item received ${index} ${ItemType[itemType]} ${namespaceName}!`)
                break;

        }


        // console.log(`Received item ${itemID} (${id})`)
        
        // if(this.items.skill_unlocks.find(x => x == itemID) && !this.slotdataHandler.apSettings.progressiveSkills){
        //     //this.skillHandler.progressSkill(itemID);
        // }
        // else if(this.items.progressive_skills.has(id) && this.slotdataHandler.apSettings.progressiveSkills){
        //     this.skillHandler.progressSkill(this.items.progressive_skills.get(id) ?? "UNKNOWN");
        // }
        // else if(this.items.skill_level_caps.find(x => x == itemID)){
        //     this.skillHandler.increaseCap(this.items.skill_caps.get(id) ?? "UNKNOWN");
        // }
        // else if(this.items.pets.find(x => x == itemID)){
        //     this.unlockPet(itemID);
        // }
        // else if(this.items.demo_extra_unlocks.find(x => x == itemID) === "Shop Unlock"){
        //     this.characterStorage.setItem(otherSavePrefix + "Shop_Unlock", 1)
        // }
        // else if(this.items.demo_extra_unlocks.find(x => x == itemID) === "Bank Unlock"){
        //     this.characterStorage.setItem(otherSavePrefix + "Bank_Unlock", 1)
        // }
        // else{
        //     console.error("Unimplemented item: ", id, itemID);
        //     return false;
        // }
        return true;
    }

    unlockPet(petName : string){
        game.petManager.unlockPetByID(petName)
    }

        
    hasShop(){
        return this.characterStorage.getItem(OtherSavePrefix + "Shop_Unlock")
    }
}
