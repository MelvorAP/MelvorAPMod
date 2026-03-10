import { Items } from "../../data/items";
import { ActionHandler } from "./actions/action_handler";
import { CookingHandler } from "./actions/cooking_handler";
import { FiremakingHandler } from "./actions/firemaking_handler";
import { MiningHandler } from "./actions/mining_handler";
import { SmithingHandler } from "./actions/smithing_handler";
import { WoodcuttingHandler } from "./actions/woodcutting_handler";

export class SkillHandler{
    private characterStorage : ModStorage;

    private actionHandlers : Array<ActionHandler>;

    constructor(ctx: ModContext, items : Items, apIcon : string){
        this.characterStorage = {} as ModStorage;

        this.actionHandlers = [
            new WoodcuttingHandler(ctx, items, apIcon),
            new MiningHandler(ctx, items, apIcon), 
            new SmithingHandler(ctx, items, apIcon), 
            new FiremakingHandler(ctx, items, apIcon),
            new CookingHandler(ctx, items, apIcon),
        ];
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.actionHandlers.forEach((value : ActionHandler) => {
            value.setCharacterStorage(characterStorage);
        });
    }

    lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            if(skill instanceof SkillWithMastery){
                let actionHandler = this.actionHandlers.find(x => x.skillId === skill.id);
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
            let actionHandler = this.actionHandlers.find(x => x.skillId === skill.id);

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
            let actionHandler = this.actionHandlers.find(x => x.skillId === skill!.id);
            
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

    hasAnyCombat(){
        return this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(Items.skillSavePrefix + "melvorD:Magic");
    }
}