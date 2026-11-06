import { MasteryMult } from "../../data/general";
import { DungeonPrefix, ItemType, SlayerAreaPrefix, StrongholdPrefix } from "../../data/items";
import { LocationType } from "../../data/locations";
import { ApCombatAreaUnlockType, ApItemReceivedType, ArchipelagoCombatItemReceivedEventMatcher } from "../../events/archipelago_event_matchers";
import { CombatAreaUnlockedEvent } from "../../events/archipelago_events";

export class BaseCombatAreaHandler {
        public type  = ApCombatAreaUnlockType;
        public areaId : string; 

        public areaIndex : number;

        private combatAreaPrefix : string;
        private itemType : ItemType;
        private characterStorage = {} as ModStorage;

        private matcher : ArchipelagoCombatItemReceivedEventMatcher | undefined;

        constructor(areaId : string, areaIndex : number, itemType : ItemType, combatAreaPrefix : string){
            this.areaId = areaId;
            this.areaIndex = areaIndex;
            this.combatAreaPrefix = combatAreaPrefix;
            this.itemType = itemType;
        }

        public initialize(){
            let data = {
                type : ApCombatAreaUnlockType,
                areaId : this.areaId,
                itemType : this.itemType
            }
            
            //@ts-ignore
            this.matcher = game.events.constructMatcher(data) as ArchipelagoCombatItemReceivedEventMatcher;
    
            //@ts-ignore
            this.matcher.assignHandler((e : CombatAreaUnlockedEvent ) => {
                    switch (e.itemType){
                        case this.itemType:
                            this.unlockCombatArea();
                            break;
                        default:
                            console.log(`Unknown item ${e.itemId} for ${e.itemType}`);
                            break;
                    }
            })
        }

        unlockCombatArea(){
            this.characterStorage.setItem(this.combatAreaPrefix + this.areaId, true);
            //@ts-ignore
            game.combat.renderQueue.areaRequirements = true
        }

        setCharacterStorage(characterStorage: ModStorage) {
            this.characterStorage = characterStorage;
        }
    }

    export class CombatAreaHandler extends BaseCombatAreaHandler {
        
        locationType : LocationType;
        skillId : string;

        constructor(areaId : string, locationType : LocationType, skillId : string, areaIndex : number, combatAreaPrefix : string){
            super(areaId, areaIndex, ItemType.CombatAreaUnlock ,combatAreaPrefix);

            this.locationType = locationType;
            this.skillId = skillId;
        }

        public initialize(): void {
            super.initialize();

            let areaIndex = this.areaIndex;
            let locationType = this.locationType;
            let skillId = this.skillId;

            //@ts-ignore
            game.combat.on("monsterKilled", function (e : {monster : Monster}) {
                let area = game.combatAreas.allObjects[areaIndex];
                
                if(area.monsters.indexOf(e.monster) == -1){
                    return;
                }             

                let monsterIndex = area.monsters.indexOf(e.monster);

                console.log("Monster killed:", e.monster.id)
                //@ts-ignore
                game.locationHandler.sendLocation(skillId, locationType, e.monster.namespace, areaIndex * MasteryMult + monsterIndex);

                //TODO send full completion on all enemies killed
            })
        }
    }

export class DungeonHandler extends BaseCombatAreaHandler {
        constructor(areaId : string, areaIndex : number){
            super(areaId, areaIndex, ItemType.DungeonUnlock, DungeonPrefix);
        }

        public initialize(): void {
            super.initialize();

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
        constructor(areaId : string, areaIndex : number){
            super(areaId, areaIndex, ItemType.StrongholdUnlock, StrongholdPrefix);
        }

        public initialize(): void {
            super.initialize();

            let areaIndex = this.areaIndex;

            //@ts-ignore
            game.combat.on("strongholdCompleted", function (e : {area : Stronghold}) {
                console.log("Stronghold Completed:", e.area.id)

                //@ts-ignore
                game.locationHandler.sendLocation(game.attack.id, LocationType.StrongholdCleared, e.area.namespace, areaIndex);
            })
        }
    }