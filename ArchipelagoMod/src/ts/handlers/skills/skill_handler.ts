import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { ActionHandler } from "./action_handler";
import { WoodcuttingHandler } from "./actions/woodcutting_handler";


let skillSavePrefix = "AP_skill_";

export class SkillHandler{
    private characterStorage : ModStorage;

    private actionHandlers : Map<string, ActionHandler>;

    constructor(items : Items, notificationHandler : NotificationHandler, apIcon : string){
        this.characterStorage = {} as ModStorage;

        this.actionHandlers = new Map<string, ActionHandler>([
            ["melvorD:Woodcutting", new WoodcuttingHandler(notificationHandler, items, apIcon)]
        ]);
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            if(skill instanceof SkillWithMastery){
                skill.sortedMasteryActions.forEach(action => {
                    this.actionHandlers.get(skill.id)?.lockAction(action as BasicSkillRecipe);
                })
            }
            else{
                console.log(`${skill.name} does not have any actions.`);
            }
        })
    }

    setLevelsToLowest(){
        game.skills.allObjects.forEach(skill => {
            if(skill instanceof SkillWithMastery){
                skill.sortedMasteryActions.forEach(action => {
                    action.level = 1;
                })
                this.actionHandlers.get(skill.id)?.refreshUI();
            }
        })
    }

    loadUnlockedSkills(){
        game.skills.allObjects.forEach(skill => {         
            let saveCount = this.actionHandlers.get(skill.id)!.getProgressiveSkillCount();

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
            let saveCount = this.actionHandlers.get(skill.id)!.getProgressiveSkillCount()!;

            console.log(`${saveName} count went up from ${saveCount} to ${saveCount +1}`);

            skill.setUnlock(true);
            this.characterStorage.setItem(saveName, saveCount + 1);
            
            this.actionHandlers.get(skill.id)?.refreshUI();
        }
        else{
            console.warn("Unknown skill", skillName);
        }
    }
    
    hasShop(){
        return this.characterStorage.getItem(skillSavePrefix + "Shop_Unlock")
    }

    hasAnyCombat(){
        return this.characterStorage.getItem(skillSavePrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(skillSavePrefix + "melvorD:Magic");
    }
}