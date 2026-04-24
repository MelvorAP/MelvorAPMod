import { Items } from "../../data/items";
import { NotificationHandler } from "../notification_handler";
import { BaseSkillHandler } from "./base_skill_handler";

export class WoodcuttingHandler extends BaseSkillHandler{

    constructor(ctx: ModContext, items : Items, apIcon : string){
        super(ctx, items, apIcon, "melvorD:Woodcutting");
        this.itemType = "tree";
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