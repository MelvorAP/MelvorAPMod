import { Items } from "../../../data/items";
import { ActionHandler } from "./action_handler";
import { ArchipelagoRequirement } from "../../../ap_classes/archipelago_requirement";

export class FishingHandler extends ActionHandler{

    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Fishing");
        this.itemType = "tree";
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        action.requirement = new ArchipelagoRequirement(super.createApRequirementData(action.id), game);
    }

    public patchSkill(){
        super.patchSkill();
        // @ts-ignore
        this.ctx.patch(Fishing, "onAreaFishSelection").replace(function(o, area : FishingArea, fish : Fish) {
            // @ts-ignore
            if(fish.requirement.isMet()){
                o(area, fish);
            }
            else{
                notifyPlayer(game.fishing, "You do not have access to this fish yet!", 'danger');
            }
        });

        // @ts-ignore
        this.ctx.patch(Fishing, "onAreaStartButtonClick").replace(function(o, area : FishingArea) {
            // @ts-ignore
            let fish : Fish = this.selectedAreaFish.get(area);
            // @ts-ignore
            if(fish.requirement.isMet()){
                o(area);
            }
            else{
                notifyPlayer(game.fishing, "You do not have access to this fish yet!", 'danger');
            }
        });
    }

    public refreshUI() {
        game.fishing.renderQueue.selectedAreaFish = true;
        game.fishing.renderQueue.selectedAreaFishRates = true;
        game.fishing.renderQueue.areaChances = true;
    }
}