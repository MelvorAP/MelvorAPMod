import { Items, ItemType, ItemTypeMult, Namespace, NamespaceMult, OtherPrefix, SkillMult } from "../data/items";
import { ApItemReceivedType, ApPetReceivedType, ApSkillItemReceivedType } from "../events/archipelago_event_matchers";
import { ArchipelagoItemReceivedEvent, CombatAreaUnlockedEvent, PetReceivedEvent, SkillItemReceivedEvent } from "../events/archipelago_events";
import { CombatUnlockHandler } from "./combat/combat_unlock_handler";
import { SkillsHandler } from "./skills_handler";
import { SlotdataHandler } from "./slotdata_handler";

//@ts-ignore
export class ItemHandler extends GameEventEmitter {
    public lastRecievedItemIndex : number = -1;

    public items : Items;

    private skillHandler : SkillsHandler;
    private slotdataHandler : SlotdataHandler;
    private combatUnlockHandler : CombatUnlockHandler;

    private characterStorage : ModStorage;

    private regularCombatAreas : CombatArea[];

    constructor(items : Items, skillHandler: SkillsHandler, slotdataHandler : SlotdataHandler, combatUnlockHandler : CombatUnlockHandler){
        super();

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

        let event;
        let eventType = ApItemReceivedType;

        switch(itemType){
            case ItemType.SkillUnlock :
            case ItemType.ProgressiveSkills :
            case ItemType.SkillLevelCaps : {
                event = new SkillItemReceivedEvent(id, itemType, skill);
                eventType = ApSkillItemReceivedType;
                break;
            }
            case ItemType.ActionLevelCaps :
                break;
            case ItemType.Pets : {
                const namespacePets = game.pets.namespaceMaps.get(namespaceName);
                const pet = Array.from( namespacePets!.values())[id];
                this.unlockPet(pet.id);

                event = new PetReceivedEvent(id, itemType, pet.id);
                eventType = ApPetReceivedType;
                
                break;
            }
            case ItemType.CombatAreaUnlock : {
                event = new CombatAreaUnlockedEvent(id, itemType, this.regularCombatAreas[id].id);
                eventType = ApSkillItemReceivedType;
                break;
            }
            case ItemType.SlayerAreaUnlock : {
                //@ts-ignore
                event = new CombatAreaUnlockedEvent(id, itemType, game.combatAreas.slayer[id].id);
                eventType = ApSkillItemReceivedType;
                break;
            }
            case ItemType.DungeonUnlock : {
                // @ts-ignore
                event = new CombatAreaUnlockedEvent(id, itemType, game.combatAreas.dungeons[id].id);
                eventType = ApSkillItemReceivedType;
                break;
            }
            case ItemType.StrongholdUnlock : {
                // @ts-ignore
                event = new CombatAreaUnlockedEvent(id, itemType, game.combatAreas.strongholds[id].id);
                eventType = ApSkillItemReceivedType;
                break;
            }
            case ItemType.OtherUnlocks : {
                switch(namespace){
                    case Namespace.melvorD :
                        switch(this.items.demo_ap_unlocks[id]){
                            case "Shop Unlock" :
                                event = new ArchipelagoItemReceivedEvent(id, itemType);
                                this.characterStorage.setItem(OtherPrefix + "Shop_Unlock", true);
                                break;
                            case "Bank Unlock" :
                                event = new ArchipelagoItemReceivedEvent(id, itemType);
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
                return false;

        }

        //@ts-ignore
        this._events.emit(eventType, event);

        return true;
    }

    unlockPet(petName : string){
        game.petManager.unlockPetByID(petName)
    }
}
