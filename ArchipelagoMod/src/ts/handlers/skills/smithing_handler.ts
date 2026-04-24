import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { BaseSkillHandler } from "./base_skill_handler";
import { ProgressiveArchipelagoRequirement } from "../../ap_classes/requirements/progressive_archipelago_requirement";

export class SmithingHandler extends BaseSkillHandler{
    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Smithing");
    }

    public patchSkill(){
        super.patchSkill();
        // @ts-ignore
        this.ctx.patch(Smithing, "selectRecipeOnClick").replace(function( o , recipe : SmithingRecipe) {
            // @ts-ignore
            if( recipe.requirement.isMet()){
                o(recipe);
            }
            else{
                notifyPlayer(game.smithing, "You do not have access to this recipe yet!", 'danger');
            }
        });
        // @ts-ignore
        this.ctx.patch(Smithing, "createButtonOnClick").replace(( o) => {
            // @ts-ignore
            if( game.smithing.selectedRecipe.requirement.isMet()){
                o();
            }
            else{
                notifyPlayer(game.smithing, "You do not have access to this recipe yet!", 'danger');
            }
        });
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ProgressiveArchipelagoRequirement(super.createApRequirementData(action.id), game);
    }

    public refreshUI() {       
        game.smithing.renderQueue.selectedRecipe = true;
        game.smithing.renderQueue.selectionTabs = true;
    }
}