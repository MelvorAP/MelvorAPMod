import { CombatAreaPrefix, DungeonPrefix, Items, ItemType, ItemTypeMult, Namespace, NamespaceMult, OtherPrefix, SkillMult, SkillPrefix, SlayerAreaPrefix, StrongholdPrefix } from "../data/items";
import { CombatUnlockHandler } from "./combat/combat_unlock_handler";
import { SkillsHandler } from "./skills_handler";
import { SlotdataHandler } from "./slotdata_handler";

export class ItemHandler{
    public lastRecievedItemIndex : number = -1;

    public items : Items;

    private skillHandler : SkillsHandler;
    private slotdataHandler : SlotdataHandler;
    private combatUnlockHandler : CombatUnlockHandler;

    private characterStorage : ModStorage;

    private regularCombatAreas : CombatArea[];

    constructor(items : Items, skillHandler: SkillsHandler, slotdataHandler : SlotdataHandler, combatUnlockHandler : CombatUnlockHandler){
        this.items = items;

        this.skillHandler = skillHandler;
        this.slotdataHandler = slotdataHandler;
        this.combatUnlockHandler = combatUnlockHandler;

        this.characterStorage = {} as ModStorage; 

        this.regularCombatAreas = [];

        game.combatAreas.forEach(area => {
            if (!(area instanceof SlayerArea) && 
                !(area instanceof Dungeon) &&
                //@ts-ignore
                !(area instanceof Stronghold) &&
                //@ts-ignore
                !(area instanceof AbyssDepth)) {
                    this.regularCombatAreas.push(area);
                }
            })
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
            case ItemType.CombatAreaUnlock : {
                this.combatUnlockHandler.unlockCombatArea(this.regularCombatAreas[id].id, CombatAreaPrefix);
                break;
            }
            case ItemType.SlayerAreaUnlock : {
                // @ts-ignore
                this.combatUnlockHandler.unlockCombatArea(game.combatAreas.slayer[id].id, SlayerAreaPrefix);
                break;
            }
            case ItemType.DungeonUnlock : {
                // @ts-ignore
                this.combatUnlockHandler.unlockCombatArea(game.combatAreas.dungeons[id].id, DungeonPrefix);
                break;
            }
            case ItemType.StrongholdUnlock : {
                // @ts-ignore
                this.combatUnlockHandler.unlockCombatArea(game.combatAreas.strongholds[id].id, StrongholdPrefix);
                break;
            }
            case ItemType.OtherUnlocks : {
                switch(namespace){
                    case Namespace.melvorD :
                        switch(this.items.demo_ap_unlocks[id]){
                            case "Shop Unlock" :
                                this.characterStorage.setItem(OtherPrefix + "Shop_Unlock", true);
                                break;
                            case "Bank Unlock" :
                                this.characterStorage.setItem(OtherPrefix + "Bank_Unlock", true);
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
        return this.characterStorage.getItem(OtherPrefix + "Shop_Unlock")
    }
}
