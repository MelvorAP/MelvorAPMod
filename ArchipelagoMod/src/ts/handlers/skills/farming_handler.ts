import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { BaseSkillHandler } from "./base_skill_handler";
import { ProgressiveSkillRequirement } from "./requirements/progressive_skill_requirement";

export class FarmingHandler extends BaseSkillHandler{
    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Farming");
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ProgressiveSkillRequirement(super.createApRequirementData(action.id), game);
    }

    public patchSkill(){
        super.patchSkill();
        // // @ts-ignore
        // this.ctx.patch(FarmingSeedSelectElement, "setSelectedRecipe").replace(function(o, recipe : FarmingRecipe, game : Game, plot : FarmingPlot) {
        //     // @ts-ignore
        //     if(recipe.requirement.isMet()){
        //         o(recipe, game, plot);
        //     }
        //     else{
        //         notifyPlayer(game.farming, "You do not have access to this recipe yet!", 'danger');
        //     }
        // });

        // @ts-ignore
        this.ctx.patch(Farming, "plantPlot").replace(function(o, plot : FarmingPlot, recipe : FarmingRecipe, isSelected : boolean) {
            // @ts-ignore
            if(recipe.requirement.isMet()){
                return o(plot, recipe, isSelected);
            }
            else{
                notifyPlayer(game.farming, "You do not have access to this recipe yet!", 'danger');
                return -1;
            }
        });
    }

    public refreshUI() {

    }
}