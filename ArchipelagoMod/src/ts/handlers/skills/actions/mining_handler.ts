import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";
import { ArchipelagoRequirement } from "../../../ap_classes/archipelago_requirement";

export class MiningHandler extends ActionHandler{
    private itemType = "rock";

    constructor(ctx : ModContext, notificationHandler : NotificationHandler, items : Items, apIcon : string){
        super(ctx, notificationHandler, items, apIcon, "melvorD:Mining");
    }

    public setLevelsToLowest(){
        const skill = game.skills.getObjectByID(this.skillId);

        if(skill instanceof SkillWithMastery){
            skill.sortedMasteryActions.forEach(action => {
                action.level = 1;
                if(action instanceof MiningRock){
                    action.totalMasteryRequired = 0;
                }
            })
            this.refreshUI();
        }
    }

    public patchSkill(){

        // @ts-ignore
        this.ctx.patch(Mining, "canMineOre").after(function(returnValue: boolean, rock : MiningRock) {
            // @ts-ignore
            return returnValue && rock.requirement.isMet();
        });
        // @ts-ignore
        this.ctx.patch(MiningRockElement, "setLockedContainer").after(function(returnValue: null, rock : MiningRock) {
            // @ts-ignore
            if(!rock.requirement.isMet()){
                // @ts-ignore
                if(!rock.addedApText) {
                    // @ts-ignore
                    this.requirementText.append(...rock.requirement.getNodes('skill-icon-xs mr-1'));
                }
                // @ts-ignore
                showElement(this.requirementText);
                // @ts-ignore
                this.setLocked();
                // @ts-ignore
                rock.addedApText = true;
            }
            else{
                // @ts-ignore
                this.hideRequirement();
                // @ts-ignore
                this.setUnlocked();
            }
        });
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ArchipelagoRequirement(super.createApRequirementData(action.id, this.itemType), game);
    }

    public refreshUI() {        
        rockMenus.forEach((value: MiningRockMenu, key: MiningRock) => {
            value.setRock(key);
        });

        game.mining.renderQueue.rockUnlock = true;
    }
}