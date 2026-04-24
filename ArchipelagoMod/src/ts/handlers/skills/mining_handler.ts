import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { BaseSkillHandler } from "./base_skill_handler";
import { ProgressiveArchipelagoRequirement } from "../../ap_classes/requirements/progressive_archipelago_requirement";

export class MiningHandler extends BaseSkillHandler{
    constructor(ctx : ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Mining");
            this.itemType = "rock";
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
        super.patchSkill();
        // @ts-ignore
        this.ctx.patch(Mining, "canMineOre").after(function(returnValue: boolean, rock : MiningRock) {
            // @ts-ignore
            return returnValue && rock.requirement.isMet();
        });
        // @ts-ignore
        this.ctx.patch(MiningRockElement, "setLockedContainer").after(function(_returnValue: null, rock : MiningRock) {
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
        action.requirement = new ProgressiveArchipelagoRequirement(super.createApRequirementData(action.id), game);
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