import { Items } from "../../data/items";
import { ActionHandler } from "./action_handler";

let skillSavePrefix = "AP_skill_";

export class SkillHandler{
    private items : Items;

    private characterStorage : ModStorage;

    constructor(items : Items){
        this.items = items;

        this.characterStorage = {} as ModStorage;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockSkills(actionHandler : ActionHandler){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            if(skill instanceof SkillWithMastery){
                skill.sortedMasteryActions.forEach(action => {
                    actionHandler.lockAction(skill.id, action as BasicSkillRecipe);
                })
            }
            else{
                console.log(`${skill.name} does not have any actions.`);
            }
        })
    }

    loadUnlockedSkills(){
        game.skills.allObjects.forEach(skill => {         
            let saveCount = this.getProgressiveSkillCount(skill.id);

            if(saveCount >= 1){
                console.log("Unlocking skill", skill.id);
                skill.setUnlock(true);
            }
        })
    }
    
    progressSkill(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(skill){
            let saveName = skillSavePrefix + skillName;
            let saveCount = this.getProgressiveSkillCount(skillName);

            console.log(`${saveName} is going from ${saveCount} to ${saveCount +1}`);

            skill.setUnlock(true);
            this.characterStorage.setItem(saveName, saveCount + 1);
        }
        else{
            console.warn("Unknown skill", skillName);
        }
    }

    getProgressiveSkillCount(skillID : string) : number{
        return this.characterStorage.getItem(skillSavePrefix + skillID) ?? 0;
    }

    hasAnyCombat(){
        return this.characterStorage.getItem(skillSavePrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Magic");
    }
}