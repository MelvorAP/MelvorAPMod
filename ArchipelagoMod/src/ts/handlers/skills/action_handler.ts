import { Items } from "../../data/items";
import { SlotdataHandler } from "../slotdata_handler";
import { SkillHandler } from "./skill_handler";

let actionSavePrefix = "AP_action_";

export interface ApRequirementData {
    type: string, 
    itemId: string, 
    itemType: string,
    isProgressive: boolean,
    countNeeded: number,
    items: Items,
    actionHandler: ActionHandler,
    skillHandler: SkillHandler,
    iconUrl: string
}

export class ActionHandler{
    private items : Items;

    private characterStorage : ModStorage;
    
    private apIcon : string;

    constructor(items : Items, apIcon : string){
        this.items = items;

        this.characterStorage = {} as ModStorage;

        this.apIcon = apIcon;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockAction(skillHandler : SkillHandler, skillId : string, action : BasicSkillRecipe){
        let countNeeded = this.items.skillActions.get(skillId)?.indexOf(action.id) ?? -1;

        if(countNeeded == -1){
            countNeeded = 999999;
        }
        else{
            countNeeded += 1;
        }

        let data : ApRequirementData = {
            type: "ArchipelagoUnlock", 
            itemId: action.id, 
            itemType: "",
            skillId: skillId,
            isProgressive: true,
            countNeeded: countNeeded,
            items: this.items,
            actionHandler: this,
            skillHandler: skillHandler,
            iconUrl: this.apIcon
        } as ApRequirementData;
        
        switch(skillId){
            case "melvorD:Woodcutting":
                console.log(`Action  ${action.id} needs ${countNeeded} skillId.`);
                
                data.itemType = "tree";
                // @ts-ignore
                game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ data ]}}]})
            default:
                //console.log(`Unknown action type ${action.id}.`);
            }

        this.refreshTrees();
    }
    
    isActionUnlocked(actionID : string) : boolean{
        return this.characterStorage.getItem(actionSavePrefix + actionID) >= 1;
    }

    setLevelsToLowest(){
        game.skills.allObjects.forEach(skill => {
            if(skill instanceof SkillWithMastery){
                skill.sortedMasteryActions.forEach(action => {
                    action.level = 1;
                })
            }
        })

        this.refreshTrees();
    }

    private refreshTrees() {

        game.woodcutting.actions.allObjects.forEach(tree => {
            // @ts-ignore
            woodcuttingMenu.treeMenus.get(tree).setTree(tree, game.woodcutting);
        })

        // @ts-ignore
        woodcuttingMenu.updateTreeUnlocks(game);
    }
}