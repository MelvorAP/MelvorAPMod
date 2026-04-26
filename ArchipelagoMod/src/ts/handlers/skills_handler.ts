import { Items, SkillCapPrefix, SkillPrefix } from "../data/items";
import { ArchipelagoItemsChangedEvent } from "../archipelago_items_changed_event";
import { BaseSkillHandler } from "./skills/base_skill_handler";
import { CookingHandler } from "./skills/cooking_handler";
import { FiremakingHandler } from "./skills/firemaking_handler";
import { MiningHandler } from "./skills/mining_handler";
import { SmithingHandler } from "./skills/smithing_handler";
import { WoodcuttingHandler } from "./skills/woodcutting_handler";
import { FishingHandler } from "./skills/fishing_handler";
import { FarmingHandler } from "./skills/farming_handler";

export class SkillsHandler{
    private characterStorage : ModStorage;

    private actionHandlers : Array<BaseSkillHandler>;

    constructor(ctx: ModContext, items : Items, apIcon : string){
        this.characterStorage = {} as ModStorage;

        this.actionHandlers = [
            new WoodcuttingHandler(ctx, items, apIcon),
            new MiningHandler(ctx, items, apIcon), 
            new SmithingHandler(ctx, items, apIcon), 
            new FiremakingHandler(ctx, items, apIcon),
            new CookingHandler(ctx, items, apIcon),
            new FishingHandler(ctx, items, apIcon),
            new FarmingHandler(ctx, items, apIcon)
        ];
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.actionHandlers.forEach((value : BaseSkillHandler) => {
            value.setCharacterStorage(characterStorage);
        });
    }

    lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            // @ts-ignore
            skill.setLevelCap(this.characterStorage.getItem(Items.skillCapSavePrefix + skill.id) ?? 1);

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
    
    unlockSkill(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(skill){
            let saveName = SkillPrefix + skill.id;
            
            this.characterStorage.setItem(saveName, true);

            skill.setUnlock(true);
            console.log(`${saveName} unlocked!`);
        }
        else{
            console.warn("Unknown skill", skillName);
        }
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
                // @ts-ignore
                game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skillName));
            }
        }
        else{
            console.warn("Unknown skill", skillName);
        }
    }

    increaseCap(skillName : string){
        let skill = game.skills.getObjectByID(skillName);

        if(!skill){
            console.warn(`Skill ${skillName} not found!`);
            return;
        }

        let cap = (this.characterStorage.getItem(SkillCapPrefix + skillName) ?? 1) + 1;

        // @ts-ignore
        if(cap > skill.maxLevelCap){
            // @ts-ignore
            console.warn(`Skill ${skillName} is already at level cap of ${skill.maxLevelCap}!`)
        }
        else{   
            this.characterStorage.setItem(SkillCapPrefix + skillName, cap);

            console.log(`Skill ${skillName} level cap went up from ${cap -1} to ${cap}`);

            // @ts-ignore
            skill.setLevelCap(cap);
            // @ts-ignore
            game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skillName));
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
        
        this.characterStorage.setItem(SkillCapPrefix + skillName, cap);

        console.log(`Skill ${skillName} level cap went up to ${cap}`);

        // @ts-ignore
        skill.setLevelCap(cap);
        // @ts-ignore
        game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent(skillName));
    }
}