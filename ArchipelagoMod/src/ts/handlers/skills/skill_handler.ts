import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { ActionHandler } from "./actions/action_handler";
import { MiningHandler } from "./actions/mining_handler";
import { SmithingHandler } from "./actions/smithing_handler";
import { WoodcuttingHandler } from "./actions/woodcutting_handler";

export class SkillHandler{
    private characterStorage : ModStorage;

    private actionHandlers : Map<string, ActionHandler>;

    constructor(ctx: ModContext, items : Items, apIcon : string){
        this.characterStorage = {} as ModStorage;

        this.actionHandlers = new Map<string, ActionHandler>([
            ["melvorD:Woodcutting", new WoodcuttingHandler(ctx, items, apIcon)],
            ["melvorD:Mining", new MiningHandler(ctx, items, apIcon)], 
            ["melvorD:Smithing", new SmithingHandler(ctx, items, apIcon)], 
        ]);
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.actionHandlers.forEach((value : ActionHandler, key : string) => {
            value.setCharacterStorage(characterStorage);
        });
    }

    lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            if(skill instanceof SkillWithMastery){
                let actionHandler = this.actionHandlers.get(skill.id);
                if(!actionHandler){
                    console.warn(`${skill.id} does not have an Action Handler! Skipping!`);
                }
                else{
                    actionHandler.patchSkill();
                    skill.sortedMasteryActions.forEach(action => {
                        actionHandler!.lockAction(action);
                    })
                }
            }
            else{
                console.log(`${skill.name} does not have any actions.`);
            }
        })
    }

    setLevelsToLowest(){
        this.actionHandlers.forEach(handler => {
            handler.setLevelsToLowest();
        })
    }

    loadUnlockedSkills(){
        game.skills.allObjects.forEach(skill => {         
            let actionHandler = this.actionHandlers.get(skill.id);

            if(!actionHandler){
                return;
            }
            else if(actionHandler.getProgressiveSkillCount() > 0){
                console.log("Unlocking skill", skill.id);
                skill.setUnlock(true);

                actionHandler.refreshUI();
            }
        })
    }
    
    progressSkill(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(skill){
            let actionHandler = this.actionHandlers.get(skill.id)
            
            if(!actionHandler){
                console.warn(`${skill.id} does not have an Action Handler! Skipping!`);
            }
            else{
                skill.setUnlock(true);
                actionHandler.increaseProgressiveSkillCount();
            }
        }
        else{
            console.warn("Unknown skill", skillName);
        }
    }
    
    hasShop(){
        return this.characterStorage.getItem(Items.skillSavePrefix + "Shop_Unlock")
    }

    hasAnyCombat(){
        return this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Magic");
    }
}