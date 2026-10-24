import { ItemTypeMult, MasteryMult, Namespace, NamespaceMult, SkillMult } from "./general";

export enum LocationType {
  SkillLevelup = 1,
  MasteryLevelUp,
  EnemyDefeated,
  CombatAreaCleared,
  SlayerAreaCleared,
  DungeonCleared,
  StrongholdCleared,
  ShopPurchase,
  OtherLocation
}

export const ShopLocationLimit = 100;

export class Locations{
	locationDict = new Map<number, [string, string]>(); 

    constructor(){
        let values = new Map<[number, LocationType, Namespace, number], [string, string]>;

        for (let namespaceMap of game.skills.namespaceMaps){
            for(let i = 0; i < namespaceMap[1].size; i++){
                let skill = Array.from(namespaceMap[1])[i][1];
                if(!skill){
                    continue;
                }

                const skillNamespace = Namespace[namespaceMap[0] as keyof typeof Namespace];
                const skillIndex = this.skills.indexOf(skill.id) + 1;

                if(!skillNamespace){
                    //console.warn(`${skill.namespace} is not supported in the AP world!`);
                    continue;
                }
                else if(skillIndex === 0){
                    console.warn(`${skill.name} is not supported in the AP world!`);
                    continue;
                }

                //Skills start at level 1
                //99 is max for dlc-free, gets upped to 120 with dlc
                for(let j = 2; j <= 99; j++){
                    values.set([skillIndex, LocationType.SkillLevelup, skillNamespace, j -2], [skill.id, `${skill.name} Level ${j}`]);
                }
                
                if(skill instanceof SkillWithMastery){
                    for(let j = 0; j < skill.actions.size; j++){
                        let action = skill.actions.allObjects[j];
                        if(action instanceof MasteryAction){
                            const actionNamespace = Namespace[action.namespace as keyof typeof Namespace];
                            if(!actionNamespace){
                                //console.warn(`${action.namespace} is not supported in the AP world!`);
                                continue;
                            }

                            for(let k = 2; k <= 99; k++){
                                values.set([skillIndex, LocationType.MasteryLevelUp, skillNamespace, j * MasteryMult + k -2], [skill.id, `${action.name} Mastery ${k}`]);
                            }
                        }
                    }
                }
            }
            for (let namespaceMap of game.combatAreas.namespaceMaps){
                for(let i = 0; i < namespaceMap[1].size; i++){
                    let area =  Array.from(namespaceMap[1])[i][1];
                    if(!area){
                        continue;
                    }

                    const namespace = Namespace[area.namespace as keyof typeof Namespace];

                    if(!namespace){
                        //console.warn(`${area.namespace} is not supported in the AP world!`);
                        continue;
                    }

                    let locationType = LocationType.CombatAreaCleared;
                    let skillIndex = this.skills.indexOf(game.attack.id) + 1;
                    let dungeon = false;

                    if(area.id == "melvorD:UnknownArea"){
                        continue;
                    }
                    // @ts-ignore
                    else if (area instanceof Stronghold){
                        locationType = LocationType.StrongholdCleared;
                        dungeon = true;
                    }
                    else if (area instanceof SlayerArea){
                        locationType = LocationType.SlayerAreaCleared;
                        skillIndex = this.skills.indexOf(game.slayer.id) + 1;
                    }
                    else if (area instanceof Dungeon){
                        locationType = LocationType.DungeonCleared;
                        dungeon = true;
                    }
                    else if (!(area instanceof CombatArea)){
                        console.warn(`Unknown area type!`);
                        continue;
                    }

                    values.set([skillIndex, locationType, namespace, i], [area.id, area.name]);

                    if(dungeon){
                        continue;
                    }

                    for(let j = 0; j < area.monsters.length; j++){
                        let monster = Array.from(area.monsters.entries())[j][1];

                        values.set([skillIndex, LocationType.EnemyDefeated, namespace, i * MasteryMult + j], [area.id, monster.name]);
                    }
                }
            }

            for(let i = 0; i < ShopLocationLimit; i++){
                let name = `Shop Purchase ${i+1}`
                values.set([0, LocationType.ShopPurchase, Namespace.melvorD, i], [name, name]);
            }

            values.forEach((name: [string, string], enums : [number, LocationType, Namespace, number]) => {
                let id = enums[0] * SkillMult + enums[1] * ItemTypeMult + enums[2] * NamespaceMult + enums[3];
                this.locationDict.set(id, name);
                if(enums[1] != LocationType.MasteryLevelUp)
                    console.log(`Location '${name[1]}' (${name[0]}) is at ${id}`)
            })
            
            console.log(`Found ${String(this.locationDict.size)} locations.`);
        }
    }

    skills_without_mastery = [
        "melvorD:Attack",
        "melvorD:Strength",
        "melvorD:Defence",
        "melvorD:Hitpoints",
        "melvorD:Ranged",
        "melvorD:Magic",
        "melvorD:Prayer",
        "melvorD:Slayer"
    ]
    
    skills_with_mastery = [
        "melvorD:Woodcutting",
        "melvorD:Fishing",
        "melvorD:Firemaking",
        "melvorD:Cooking",
        "melvorD:Mining",
        "melvorD:Smithing",
        "melvorD:Farming"
  ]

  skills = [
    ...this.skills_without_mastery,
    ...this.skills_with_mastery
  ]
}