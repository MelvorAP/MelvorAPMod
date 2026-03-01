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
            if(!this.apRequirementDiv) {
                rock.totalMasteryRequired = 0;
                // @ts-ignore
                let node : Node = this.getElementsByClassName("text-danger")[1];
                // @ts-ignore
                let div = rock.requirement.getContainer('skill-icon-xs mr-1');
                // @ts-ignore
                node.parentNode.insertBefore(div, node);
                // @ts-ignore
                this.apRequirementDiv = div;
            }
            // @ts-ignore
            if(!rock.requirement.isMet()){
                // @ts-ignore
                this.apRequirementDiv.classList.remove("d-none");
                // @ts-ignore
                this.setLocked();
            }
            else{
                // @ts-ignore
                this.apRequirementDiv.classList.add("d-none");
                // @ts-ignore
                this.setUnlocked();
            }
            if(rock.totalMasteryRequired === 0){
                // @ts-ignore
                this.hideRequirement();
            }

        });
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ArchipelagoRequirement(super.createApRequirementData(action.id, this.itemType), game);
        // @ts-ignore
        game.mining.modifyData({rockData: [{id: action.id, totalMasteryRequired: 0}]})
    }

    public refreshUI() {        
        rockMenus.forEach((menu: MiningRockMenu, rock: MiningRock) => {
            menu.setRock(rock);
        });

        game.mining.renderQueue.rockUnlock = true;
    }
}