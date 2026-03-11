import { Items, SkillCapSavePrefix, SkillSavePrefix } from "../../data/items";
import { ArchipelagoItemsChangedEvent } from "../../ap_classes/archipelago_items_changed_event";
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
                // @ts-ignore
                skill.setLevelCap(this.characterStorage.getItem(Items.skillCapSavePrefix + skill.id) ?? 1);

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

    setLevelRequirementsToLowest(){
        this.actionHandlers.forEach(handler => {
            handler.setLevelRequirementsToLowest();
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

    unlockSkill(skill : AnySkill){
        let saveName = SkillSavePrefix + skill.id;
        
        this.characterStorage.setItem(saveName, true);

        skill.setUnlock(true);
        console.log(`${saveName} unlocked!`);
    }
    
    progressSkill(skill : AnySkill){
        let actionHandler = this.actionHandlers.find(x => x.skillId === skill!.id);
        
        if(!actionHandler){
            console.warn(`${skill.id} does not have an Action Handler! Skipping!`);
        }
        else{
            skill.setUnlock(true);
            actionHandler.increaseProgressiveSkillCount();
            // @ts-ignore
            game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skill.id));
        }
    }

    increaseCap(skill : AnySkill){
        let saveId = SkillCapSavePrefix + skill.id;
        let cap = (this.characterStorage.getItem(saveId) ?? 1) + 1;

        // @ts-ignore
        if(cap > skill.maxLevelCap){
            // @ts-ignore
            console.warn(`Skill ${skill.name} is already at level cap of ${skill.maxLevelCap}!`)
        }
        else{   
            this.characterStorage.setItem(saveId, cap);

            console.log(`Skill ${skill.name} level cap went up from ${cap -1} to ${cap}`);

            // @ts-ignore
            skill.setLevelCap(cap);
            // @ts-ignore
            game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skill.id));
        }
    }

    increaseCapToMax(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(!skill){
            console.warn(`Skill ${skillName} not found!`);
            return;
        }

        // @ts-ignore
        let cap = skill.maxLevelCap as number;
        
        this.characterStorage.setItem(SkillCapSavePrefix + skillName, cap);

        console.log(`Skill ${skillName} level cap went up to ${cap}`);

        // @ts-ignore
        skill.setLevelCap(cap);
        // @ts-ignore
        game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skillName));
    }

    hasAnyCombat(){
        return this.characterStorage.getItem(SkillSavePrefix + "melvorD:Attack") ||
            this.characterStorage.getItem(SkillSavePrefix + "melvorD:Strength") ||
            this.characterStorage.getItem(SkillSavePrefix + "melvorD:Ranged") ||
            this.characterStorage.getItem(SkillSavePrefix + "melvorD:Magic");
    }
}