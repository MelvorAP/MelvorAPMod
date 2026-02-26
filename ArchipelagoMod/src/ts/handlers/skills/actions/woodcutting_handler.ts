import { Items } from "src/ts/data/items";
import { NotificationHandler } from "../../notification_handler";
import { ActionHandler } from "./action_handler";

export class WoodcuttingHandler extends ActionHandler{
    private itemType = "tree";

    constructor(ctx: ModContext, notificationHandler : NotificationHandler, items : Items, apIcon : string){
        super(ctx, notificationHandler, items, apIcon, "melvorD:Woodcutting");
    }

    public lockAction(action : BasicSkillRecipe){
        // @ts-ignore
        game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ super.createApRequirementData(action.id, this.itemType) ]}}]})
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