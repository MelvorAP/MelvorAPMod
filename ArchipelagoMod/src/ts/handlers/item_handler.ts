import { Items, ItemType, ItemTypeMult, Namespace, NamespaceMult, OtherSavePrefix, SkillMult } from "../data/items";
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
        const skill_id = Math.floor(id / SkillMult)
        id -= skill_id * SkillMult;
        const itemtype_id = Math.floor(id/ItemTypeMult);
        id -= itemtype_id * ItemTypeMult;
        const namespace_id = Math.floor(id / NamespaceMult);
        id -= namespace_id * NamespaceMult;

        const itemType = itemtype_id as ItemType;
        const namespace = namespace_id as Namespace;
        const namespaceName = Namespace[namespace]
        const skill = this.items.skills[skill_id - 1];

        if(!namespace){
            console.warn(`${namespace} is not supported in the AP world!`);
            return;
        }

        switch(itemType){
            case ItemType['Skills'] : {
                this.skillHandler.unlockSkill(skill);
                break;
            }
            case ItemType.ProgressiveSkills : {
                this.skillHandler.progressSkill(skill);
                break;
            }
            case ItemType.SkillLevelCaps : {
                this.skillHandler.increaseCap(skill);
                break;
            }
            case ItemType.ActionLevelCaps :
                break;
            case ItemType.Pets : {
                const namespacePets = game.pets.namespaceMaps.get(namespaceName);
                const pet = Array.from( namespacePets!.values())[id];
                this.unlockPet(pet.id);
                break;
            }
            case ItemType.OtherUnlocks : {
                switch(namespace){
                    case Namespace.melvorD :
                        switch(this.items.demo_ap_unlocks[id]){
                            case "Shop Unlock" :
                                this.characterStorage.setItem(OtherSavePrefix + "Shop_Unlock", true);
                                break;
                            case "Bank Unlock" :
                                this.characterStorage.setItem(OtherSavePrefix + "Bank_Unlock", true);
                                break;
                        }
                        break;
                    // case Namespace.melvorF :
                    //     break;
                    default :
                        break;
                }

                break;
            }
            default:
                console.warn(`Unknown item received ${id} ${skill} ${ItemType[itemType]} ${namespaceName}!`)
                break;

        }

        return true;
    }

    unlockPet(petName : string){
        game.petManager.unlockPetByID(petName)
    }

        
    hasShop(){
        return this.characterStorage.getItem(OtherSavePrefix + "Shop_Unlock")
    }
}
