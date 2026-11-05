import { MasteryMult } from "../../data/general";
import { ItemType, SlayerAreaPrefix, StrongholdPrefix } from "../../data/items";
import { LocationType } from "../../data/locations";
import { ApCombatAreaUnlockType, ApItemReceivedType, ArchipelagoItemReceivedEventMatcher } from "../../events/archipelago_event_matchers";

export class BaseCombatAreaHandler {
        public areaId : string; 

        public areaIndex : number;

        private combatAreaPrefix : string;
        private itemTypes;
        private characterStorage : ModStorage;

        constructor(areaId : string, areaIndex : number, combatAreaPrefix : string, characterStorage : ModStorage){
            this.areaId = areaId;
            this.areaIndex = areaIndex;
            this.combatAreaPrefix = combatAreaPrefix;
            this.characterStorage = characterStorage;
        }

        public Initialize(){
            let data = {
                type : ApItemReceivedType,
                callType : ApCombatAreaUnlockType,
                itemTypes : this.itemTypes
            }
            
            //@ts-ignore
            this.matcher = game.events.constructMatcher(data) as ArchipelagoItemReceivedEventMatcher;
    
            //@ts-ignore
            this.matcher.assignHandler((e : CombatAreaUnlockedEvent ) => {
                    switch (e.itemType){
                        case ItemType.CombatAreaUnlock:
                            this.unlockCombatArea(e.areaId, this.combatAreaPrefix);
                            break;
                        default:
                            console.log(`Unknown item ${e.itemId} for ${e.itemType}`);
                            break;
                    }
            })
        }

        unlockCombatArea(areaId : string, savePrefix : string){
            this.characterStorage.setItem(savePrefix + areaId, true);
            //@ts-ignore
            game.combat.renderQueue.areaRequirements = true
        }
    }

    export class CombatAreaHandler extends BaseCombatAreaHandler {
        
        locationType : LocationType;
        skillId : string;

        constructor(areaId : string, locationType : LocationType, skillId : string, areaIndex : number, combatAreaPrefix : string, characterStorage : ModStorage){
            super(areaId, areaIndex, combatAreaPrefix, characterStorage);

            this.locationType = locationType;
            this.skillId = skillId;
        }

        public Initialize(): void {
            super.Initialize();

            let areaIndex = this.areaIndex;
            let locationType = this.locationType;
            let skillId = this.skillId;

            //@ts-ignore
            game.combat.on("monsterKilled", function (e : {monster : Monster}) {
                console.log("Monster killed:", e.monster.id)

                let monsterIndex = game.combatAreas.allObjects[areaIndex].monsters.indexOf(e.monster);
                //@ts-ignore
                game.locationHandler.sendLocation(skillId, locationType, e.monster.namespace, areaIndex * MasteryMult + monsterIndex);

                //TODO send full completion on all enemies killed
            })
        }
    }

export class DungeonHandler extends BaseCombatAreaHandler {
        constructor(areaId : string, areaIndex : number, characterStorage : ModStorage){
            super(areaId, areaIndex, SlayerAreaPrefix, characterStorage);
        }

        public Initialize(): void {
            super.Initialize();

            let areaIndex = this.areaIndex;

            //@ts-ignore
            game.combat.on("dungeonCompleted", function (e : {area : Dungeon}) {
                console.log("Dungeon Completed:", e.area.id)

                //@ts-ignore
                game.locationHandler.sendLocation(game.attack.id, LocationType.DungeonCleared, e.area.namespace, areaIndex);
            })
        }
    }

export class StrongHoldHandler extends BaseCombatAreaHandler {
        constructor(areaId : string, areaIndex : number, characterStorage : ModStorage){
            super(areaId, areaIndex, StrongholdPrefix, characterStorage);
        }

        public Initialize(): void {
            super.Initialize();

            let areaIndex = this.areaIndex;

            //@ts-ignore
            game.combat.on("strongholdCompleted", function (e : {area : Stronghold}) {
                console.log("Stronghold Completed:", e.area.id)

                //@ts-ignore
                game.locationHandler.sendLocation(game.attack.id, LocationType.StrongholdCleared, e.area.namespace, areaIndex);
            })
        }
    }