import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";
import { ArchipelagoRequirement } from "../../../ap_classes/archipelago_requirement";

export class MiningHandler extends ActionHandler{
    private itemType = "rock";

    constructor(ctx : ModContext, notificationHandler : NotificationHandler, items : Items, apIcon : string){
        super(ctx, notificationHandler, items, apIcon, "melvorD:Mining");
    }

    meow = () => {
        return this.skillId
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
                this.setRequirement("Item not collected yet!");
            }
            else{
                // @ts-ignore
                this.hideRequirement();
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