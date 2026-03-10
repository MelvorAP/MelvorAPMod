import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";
import { ArchipelagoRequirement } from "../../../ap_classes/archipelago_requirement";

export class CookingHandler extends ActionHandler{

    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Cooking");
    }

    public patchSkill(){
        // @ts-ignore
        this.ctx.patch(Cooking, "onRecipeSelectionClick").replace(function(o, recipe : CookingRecipe) {
            // @ts-ignore
            if(recipe.requirement.isMet()){
                o(recipe);
            }
            else{
                notifyPlayer(game.cooking, "You do not have access to this recipe yet!", 'danger');
            }
        });
        // @ts-ignore
        this.ctx.patch(Cooking, "onActiveCookButtonClick").replace(function(o, category : CookingCategory) {
            // @ts-ignore
            let recipe = game.cooking.selectedRecipes.get(category);
            // @ts-ignore
            if(recipe.requirement.isMet()){
                o(category);
            }
            else{
                notifyPlayer(game.cooking, "You do not have access to this recipe yet!", 'danger');
            }
        });
        // @ts-ignore
        this.ctx.patch(Cooking, "onPassiveCookButtonClick").replace(function(o, category : CookingCategory) {
            // @ts-ignore
            let recipe = game.cooking.selectedRecipes.get(category);
            // @ts-ignore
            if(recipe.requirement.isMet()){
                o(category);
            }
            else{
                notifyPlayer(game.cooking, "You do not have access to this recipe yet!", 'danger');
            }
        });
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ArchipelagoRequirement(super.createApRequirementData(action.id), game);
    }

    public refreshUI() {
        // @ts-ignore
        let category = game.cooking.activeCookingCategory as CookingCategory;

        if(category){
            game.cooking.renderQueue.selectedRecipes.add(category);
        }

        game.cooking.renderQueue.recipeRates = true;
        game.cooking.renderQueue.quantities = true;
        game.cooking.renderQueue.upgrades = true;
    }
}