import { CombatAreaPrefix, DungeonPrefix, ItemType, SkillPrefix, SlayerAreaPrefix, StrongholdPrefix } from "../../data/items";
import { LocationType } from "../../data/locations";
import { ApCombatAreaUnlockType, ApItemReceivedType, ArchipelagoSkillItemReceivedEventMatcher } from "../../events/archipelago_event_matchers";
import { CombatAreaUnlockedEvent } from "../../events/archipelago_events";
import { BaseCombatAreaHandler, CombatAreaHandler, DungeonHandler, StrongHoldHandler } from "./combat_area_handler";
import { CombatRequirement, CombatRequirementData, CombatRequirementType } from "./combat_requirements";

//@ts-ignore
export class CombatUnlockHandler extends GameEventEmitter{
    private apIcon : string;

    private characterStorage : ModStorage;

    private areaHandlers : Array<BaseCombatAreaHandler>;

    private ctx: ModContext;
    private matcher: ArchipelagoSkillItemReceivedEventMatcher | undefined;

    constructor(ctx : ModContext, apIcon : string){
        super();
        this.apIcon = apIcon;
        this.ctx = ctx;

        this.characterStorage = {} as ModStorage;

        this.areaHandlers = [];
        

        for(let i = 0; i < game.combatAreas.size; i++){
            let area = game.combatAreas.allObjects[i];

            let handler : BaseCombatAreaHandler;

            if(area.id == "melvorD:UnknownArea"){
                continue;
            }
            // @ts-ignore
            else if (area instanceof Stronghold){
                handler = new StrongHoldHandler(area.id, i);
            }
            else if (area instanceof SlayerArea){
                handler = new CombatAreaHandler(area.id, LocationType.SlayerAreaCleared, game.slayer.id, i, SlayerAreaPrefix);
            }
            else if (area instanceof Dungeon){
                handler = new DungeonHandler(area.id, i);
            }
            else if (!(area instanceof CombatArea)){
                console.warn(`Unknown area type!`);
                continue;
            }
            else{
                handler = new CombatAreaHandler(area.id, LocationType.CombatAreaCleared, game.attack.id, i, CombatAreaPrefix);
            }

            this.areaHandlers.push(handler!);
        }
    }

    public initialize(){
        this,this.areaHandlers.forEach(handler => {
            handler.initialize();
        });
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this,this.areaHandlers.forEach(handler => {
            handler.setCharacterStorage(characterStorage);
        });
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