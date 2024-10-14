import { ApRequirementData } from "src/ts/ap_classes/archipelago_requirement";
import { Items } from "../../data/items";
import { SlotdataHandler } from "../slotdata_handler";
import { SkillHandler } from "./skill_handler";
import { NotificationHandler } from "../notification_handler";

let actionSavePrefix = "AP_action_";

export class ActionHandler{
    private skillHandler : SkillHandler;
    private notificationHandler : NotificationHandler;

    private items : Items;

    private characterStorage : ModStorage;
    
    private apIcon : string;

    constructor(skillHandler : SkillHandler, notificationHandler : NotificationHandler, items : Items, apIcon : string){
        this.skillHandler = skillHandler;
        this.notificationHandler = notificationHandler;
        
        this.items = items;

        this.characterStorage = {} as ModStorage;

        this.apIcon = apIcon;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockAction(skillId : string, action : BasicSkillRecipe){
        let countNeeded = this.items.skill_actions.get(skillId)?.indexOf(action.id) ?? -1;

        if(countNeeded == -1){
            countNeeded = 999999;
            console.log(`Invalid count needed for ${action.id}.`);
        }
        else{
            countNeeded += 1;
        }

        let data : ApRequirementData = {
            type: "ArchipelagoUnlock", 
            itemId: action.id, 
            itemType: "ERROR",
            skillId: skillId,
            isProgressive: true,
            countNeeded: countNeeded,
            items: this.items,
            actionHandler: this,
            skillHandler: this.skillHandler,
            notificationHandler: this.notificationHandler,
            iconUrl: this.apIcon
        } as ApRequirementData;
        
        switch(skillId){
            case "melvorD:Woodcutting":
                data.itemType = "tree";
                // @ts-ignore
                game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            case "melvorD:Fishing":
                data.itemType = "fish";
                // @ts-ignore
                game.fishing.modifyData({fish: [{id: action.id, requirements: {add: [ data ]}}]})
            case "melvorD:Firemaking":
                data.itemType = "log";
                // @ts-ignore
                game.firemaking.modifyData({logs: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            case "melvorD:Cooking":
                data.itemType = "recipe";
                // @ts-ignore
                game.cooking.modifyData({recipes: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            case "melvorD:Mining":
                data.itemType = "rock";
                // @ts-ignore
                game.mining.modifyData({rockData: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            case "melvorD:Smithing":
                data.itemType = "recipe";
                // @ts-ignore
                game.cooking.modifyData({recipe: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            case "melvorD:Farming":
                data.itemType = "seed";
                // @ts-ignore
                game.farming.modifyData({seeds: [{id: action.id, requirements: {add: [ data ]}}]})
                break;
            default:
                console.log(`Unknown action type ${action.id}.`);
                break;
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