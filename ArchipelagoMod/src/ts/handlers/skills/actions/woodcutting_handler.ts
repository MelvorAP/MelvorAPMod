import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "../action_handler";

export class WoodcuttingHandler extends ActionHandler{

    constructor(notificationHandler : NotificationHandler, items : Items, apIcon : string){
        super(notificationHandler, items, apIcon, "melvorD:Woodcutting", "tree");
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ super.createApRequirementData(action.id) ]}}]})
    }

    public refreshUI() {
        game.woodcutting.actions.allObjects.forEach(tree => {
            // @ts-ignore
            woodcuttingMenu.treeMenus.get(tree).setTree(tree, game.woodcutting);
        })

        // @ts-ignore
        woodcuttingMenu.updateTreeUnlocks(game);
        
        game.woodcutting.renderQueue.treeUnlocks = true;
    }
}