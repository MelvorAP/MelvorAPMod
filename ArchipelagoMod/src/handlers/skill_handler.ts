import { ArchipelagoRequirement } from "src/ap_classes/archipelago_requirement.mjs";
import { Items } from "../data/items";

let skillSavePrefix = "AP_skill_";
let actionSavePrefix = "AP_action_";

export interface ApRequirementData {
    type: string, 
    itemId: string, 
    itemType: string,
    isProgressive: boolean,
    countNeeded: number,
    items: Items,
    skillHandler: SkillHandler,
    iconUrl: string
}

export class SkillHandler{
    private items : Items;

    private characterStorage : ModStorage;
    
    private apIcon : string;

    constructor(items : Items, characterStorage : ModStorage, apIcon : string){
        this.items = items;
        this.characterStorage = characterStorage;

        this.apIcon = apIcon;
    }

    lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            if(skill instanceof SkillWithMastery){
                skill.sortedMasteryActions.forEach(action => {
                    this.lockAction(skill.id, action as BasicSkillRecipe);
                })
            }
            else{
                console.log(`${skill.name} does not have any actions.`);
            }
        })
    }

    lockAction(skillId : string, action : BasicSkillRecipe, ){
        let data : ApRequirementData = {
            type: "ArchipelagoUnlock", 
            itemId: action.id, 
            itemType: skillId,
            isProgressive: false,
            countNeeded: 1,
            items: this.items,
            skillHandler: this,
            iconUrl: this.apIcon
        } as ApRequirementData;
        
        switch(skillId){
            case "melvorD:Woodcutting":
                // @ts-ignore
                game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ data ]}}]})
                // @ts-ignore
                woodcuttingMenu.treeMenus.get(action).setTree(action, game.woodcutting);
                woodcuttingMenu.updateTreeUnlocks();
            default:
                console.log(`Unknown action type ${action.id}.`);
            }
    }

    loadUnlockedSkills(){
        const iterator = this.items.itemDict.entries();

        for(let i = 0; i < this.items.itemDict.size; i++){
            const v = iterator.next().value;

            const itemId = v[0];
            const itemName = v[1];

            const saveCount = this.characterStorage.getItem(skillSavePrefix + itemName)

            if(saveCount){
                for(let i = 0; i < saveCount; i++){
                    this.unlockSkill(itemName);
                }
            }
        }
    }
    
    unlockSkill(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(skill){
            skill.setUnlock(true);
            this.characterStorage.setItem(skillSavePrefix + skillName, 1);
        }
    }

    isActionUnlocked(actionID : string) : boolean{
        return this.characterStorage.getItem(actionSavePrefix + actionID) >= 1;
    }

    getProgressiveSkillCount(skillID : string) : boolean{
        return this.characterStorage.getItem(skillSavePrefix + skillID) ?? 0;
    }
}