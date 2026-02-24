import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";

export class MiningHandler extends ActionHandler{
    private itemType = "rock";

    constructor(notificationHandler : NotificationHandler, items : Items, apIcon : string){
        super(notificationHandler, items, apIcon, "melvorD:Mining");
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        game.mining.modifyData({rockData: [{id: action.id, totalMasteryRequired: {add: [ super.createApRequirementData(action.id, this.itemType) ]}}]})
    }

    public refreshUI() {   
        rockMenus.forEach((value: MiningRockMenu, key: MiningRock) => {
            value.setRock(key);
        });

        game.mining.renderQueue.rockUnlock = true;
    }
}