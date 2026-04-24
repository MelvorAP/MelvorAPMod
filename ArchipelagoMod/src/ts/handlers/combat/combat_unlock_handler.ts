import { CombatAreaPrefix, Items } from "../../data/items";
import { ItemHandler } from "../item_handler";
import { CombatRequirement, CombatRequirementData } from "./requirement/combat_requirement";

export class CombatUnlockHandler{
    private apIcon : string;

    private itemHandler : ItemHandler;
    private characterStorage : ModStorage;

    constructor(itemHandler : ItemHandler, apIcon : string){
        this.itemHandler = itemHandler;
        this.apIcon = apIcon;

        this.characterStorage = {} as ModStorage;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockCombatAreas(){
        game.combatAreas.allObjects.forEach(area => {
            let requirement = new CombatRequirement(this.createApRequirementData(area.id, "area", CombatAreaPrefix), game);

            //@ts-ignore
            area.entryRequirements.push(requirement);
        })
    }

    protected createApRequirementData(areaId : string, itemType : string, savePrefix : string) : CombatRequirementData{
        
        return {
            itemId: areaId, 
            itemType : itemType,
            savePrefix: savePrefix,
            iconUrl: this.apIcon,

            itemHandler: this.itemHandler,
            characterStorage: this.characterStorage
        } as CombatRequirementData;
    }
}