import { Items, SkillCapPrefix, SkillPrefix } from "../data/items";
import { BaseSkillHandler } from "./skills/base_skill_handler";
import { CookingHandler } from "./skills/cooking_handler";
import { FiremakingHandler } from "./skills/firemaking_handler";
import { MiningHandler } from "./skills/mining_handler";
import { SmithingHandler } from "./skills/smithing_handler";
import { WoodcuttingHandler } from "./skills/woodcutting_handler";
import { FishingHandler } from "./skills/fishing_handler";
import { FarmingHandler } from "./skills/farming_handler";
import { SkillItemReceivedEvent } from "../events/archipelago_events";

export class SkillsHandler{
    private characterStorage : ModStorage;

    private skillHandlers : Array<BaseSkillHandler>;

    constructor(ctx: ModContext, items : Items, apIcon : string){
        this.characterStorage = {} as ModStorage;

        this.skillHandlers = [
            new WoodcuttingHandler(ctx, items, apIcon),
            new MiningHandler(ctx, items, apIcon), 
            new SmithingHandler(ctx, items, apIcon), 
            new FiremakingHandler(ctx, items, apIcon),
            new CookingHandler(ctx, items, apIcon),
            new FishingHandler(ctx, items, apIcon),
            new FarmingHandler(ctx, items, apIcon)
        ];
    }

    public setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;

        this.skillHandlers.forEach((value : BaseSkillHandler) => {
            value.setCharacterStorage(characterStorage);
        });
    }

    public lockSkills(){
        game.skills.allObjects.forEach(skill => {
            skill.setUnlock(false);
            
            console.log("Locking skill", skill.id);

            // @ts-ignore
            skill.setLevelCap(this.characterStorage.getItem(Items.skillCapSavePrefix + skill.id) ?? 1);

            if(skill instanceof SkillWithMastery){

                let skillHandler = this.skillHandlers.find(x => x.skillId === skill.id);
                if(!skillHandler){
                    console.warn(`${skill.id} does not have an Action Handler! Skipping!`);
                }
                else{
                    skillHandler.patchSkill();
                    skill.sortedMasteryActions.forEach(action => {
                        skillHandler!.lockAction(action);
                    })
                }
            }
            else{
                console.log(`${skill.name} does not have any actions.`);
            }
        })
    }

    public setLevelRequirementsToLowest(){
        this.skillHandlers.forEach(handler => {
            handler.setLevelRequirementsToLowest();
        })
    }

    public getSkillHandler(skillId : string) : BaseSkillHandler | undefined {
        return this.skillHandlers.find(x => x.skillId === skillId);
    }

    loadUnlockedSkills(){
        game.skills.allObjects.forEach(skill => {         
            let skillHandler = this.getSkillHandler(skill.id);

            if(!skillHandler){
                return;
            }
            else if(skillHandler.getProgressiveSkillCount() > 0){
                console.log("Unlocking skill", skill.id);
                skill.setUnlock(true);

                skillHandler.refreshUI();
            }
        })
    }
    
    unlockSkill(skillId : string){
        let skill = game.skills.getObjectByID(skillId);

        if(skill){
            let saveName = SkillPrefix + skill.id;
            
            this.characterStorage.setItem(saveName, true);

            skill.setUnlock(true);
            console.log(`${saveName} unlocked!`);
        }
        else{
            console.warn("Unknown skill", skillId);
        }
    }
    
    progressSkill(skillId : string){
        let skillHandler = this.getSkillHandler(skillId);

        if(skillHandler){
            return skillHandler.increaseProgressiveSkillCount();
        }
        else{
            console.warn("Unknown skill", skillId);
        }
    }

    increaseCap(skillId : string){
        let skillHandler = this.getSkillHandler(skillId);

        if(skillHandler){
            return skillHandler.increaseCap();
        }
        else{
            console.warn("Unknown skill", skillId);
        }
    }

    increaseCapToMax(skillId : string){
        let skillHandler = this.getSkillHandler(skillId);

        if(skillHandler){
            return skillHandler.increaseCapToMax();
        }
        else{
            console.warn("Unknown skill", skillId);
        }
    }
}