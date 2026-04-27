import { ArchipelagoItemsChangedEvent } from "../../archipelago_items_changed_event";
import { CombatAreaPrefix, DungeonPrefix, Items, SkillPrefix, SlayerAreaPrefix, StrongholdPrefix } from "../../data/items";
import { ItemHandler } from "../item_handler";
import { CombatRequirement, CombatRequirementData, CombatRequirementType } from "./requirement/combat_requirement";

export class CombatUnlockHandler{
    private apIcon : string;

    private characterStorage : ModStorage;

    private ctx: ModContext;

    constructor(ctx : ModContext, apIcon : string){
        this.apIcon = apIcon;
        this.ctx = ctx;

        this.characterStorage = {} as ModStorage;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockCombatAreas(){
        // @ts-ignore
        this.ctx.patch(CombatAreaMenuElement, "setRequirements").after(function(_returnValue, area : CombatArea) {
            if (area.entryRequirements.length > 0) {
                // @ts-ignore
                const small = this.entryRequirements;
                // @ts-ignore
                const reqSpans = this.requirements;
                area.entryRequirements.forEach((requirement) => {
                    const listEl = createElement('li');
                    listEl.lastChild
                    let reqSpan;
                    // @ts-ignore
                    if(requirement.type == CombatRequirementType){
                        // @ts-ignore
                        let combatRequirement = requirement as CombatRequirement;
                            // @ts-ignore
                            listEl.appendChild(this.createReqImage(combatRequirement.iconUrl));
                            // @ts-ignore
                            reqSpan = this.createReqSpan(`Find this ${combatRequirement.itemType} to acces it!`);
                            reqSpans.push(reqSpan);
                            listEl.appendChild(reqSpan);
                    }
                    small.appendChild(listEl);
                })
            }
        });

        game.combatAreas.allObjects.forEach(area => {
            if(area.id == "melvorD:UnknownArea"){
                console.log("Skipping unknown area");
            }
            // @ts-ignore
            else if (area instanceof Stronghold){
                //@ts-ignore
                area.applyDataModification({entryRequirements: {add: [ this.createApRequirementData(area.id, "stronghold", StrongholdPrefix) ]}}, game);
                this.removeSlayerRequirement(area);
            }
            else if (area instanceof SlayerArea){
                //@ts-ignore
                area.applyDataModification({entryRequirements: {add: [ this.createApRequirementData(area.id, "area", SlayerAreaPrefix) ]}}, game);
                this.removeSlayerRequirement(area);
            }
            else if (area instanceof Dungeon){
                //@ts-ignore
                area.applyDataModification({entryRequirements: {add: [ this.createApRequirementData(area.id, "dungeon", DungeonPrefix) ]}}, game);
            }
            else if (area instanceof CombatArea){
                //@ts-ignore
                area.applyDataModification({entryRequirements: {add: [ this.createApRequirementData(area.id, "area", CombatAreaPrefix) ]}}, game);
            }
            else{
                console.warn(`Unknown area type!`);
            }
        })
    }

    unlockCombatArea(areaId : string, savePrefix : string){
        this.characterStorage.setItem(savePrefix + areaId, true);
        //@ts-ignore
        game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent("Attack"));
        //@ts-ignore
        game.combat.renderQueue.areaRequirements = true
    }

    isAreaUnlocked(savePrefix : string, itemId : string){
        return this.characterStorage.getItem(savePrefix + itemId) as boolean
    }

    hasAnyCombat(){
        return this.characterStorage.getItem(SkillPrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(SkillPrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(SkillPrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(SkillPrefix + "melvorD:Magic");
    }

    protected createApRequirementData(areaId : string, itemType : string, savePrefix : string) : CombatRequirementData{
        
        return {
            type: CombatRequirementType,
            itemId: areaId, 
            itemType : itemType,
            savePrefix: savePrefix,
            iconUrl: this.apIcon,

            combatUnlockHandler: this
        } as CombatRequirementData;
    }

    private removeSlayerRequirement(area : CombatArea) {
            //@ts-ignore
            area.applyDataModification({entryRequirements: {remove: [ "SkillLevel" ]}}, game);
    }
}