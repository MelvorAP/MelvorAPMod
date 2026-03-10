import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";
import { ArchipelagoRequirement } from "../../../ap_classes/archipelago_requirement";

export class FiremakingHandler extends ActionHandler{

    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Firemaking");
        this.itemType = "log";
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ArchipelagoRequirement(super.createApRequirementData(action.id), game);
    }

    public patchSkill(){
        // @ts-ignore
        this.ctx.patch(Firemaking, "selectLog").replace(function(o, recipe) {
            // @ts-ignore
            if(recipe.requirement.isMet()){
                o(recipe);
            }
            else{
                notifyPlayer(game.firemaking, "You do not have access to this log yet!", 'danger');
            }
        });
        // @ts-ignore
        this.ctx.patch(Firemaking, "burnLog").replace(function(o) {
            // @ts-ignore
            if( this.selectedRecipe.requirement.isMet()){
                o();
            }
            else{
                notifyPlayer(game.firemaking, "You do not have access to this log yet!", 'danger');
            }
        });
        // @ts-ignore
        this.ctx.patch(FiremakingLogMenuElement, "updateOptions").replace(function(o, game : Game, firemaking : Firemaking) {
            // @ts-ignore
            this.recipeOptions.forEach((option, recipe) => {
                option.name.textContent = '';
                // @ts-ignore
                if (!recipe.requirement.isMet()) {
                    // @ts-ignore
                    option.name.innerHTML += recipe.requirement.getContainer('skill-icon-xs mr-1 text-danger').innerHTML;
                    option.link.classList.add('text-danger');
                }
                // @ts-ignore
                else if (recipe.level > firemaking.level || recipe.abyssalLevel > firemaking.abyssalLevel) {
                    // @ts-ignore
                    option.name.innerHTML += `<span class="${getRequirementTextClass(recipe.level < firemaking.level)}">${templateLangString('MENU_TEXT_REQUIRES_LEVEL', {
                        level: `${recipe.level}`,
                    })}</span>`;
                    if (recipe.abyssalLevel > 0) {
                        // @ts-ignore
                        option.name.innerHTML += `<br><span class="${getRequirementTextClass(recipe.abyssalLevel < firemaking.abyssalLevel)}">${templateLangString('MENU_TEXT_REQUIRES_ABYSSAL_LEVEL', {
                            level: `${recipe.abyssalLevel}`,
                        })}`;
                    }
                }
                else {
                    option.name.textContent = recipe.log.name;
                    option.link.classList.remove('text-danger');
                }
            });
        });
    }

    public refreshUI() {
        // @ts-ignore
        firemakingMenu.logs.updateOptions(Game, firemakingMenu);
        // @ts-ignore
        firemakingMenu.oil.updateOptions(Game, firemakingMenu);
    }
}