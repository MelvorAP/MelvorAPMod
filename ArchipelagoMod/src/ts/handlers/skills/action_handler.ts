import { ApRequirementData } from "src/ts/ap_classes/archipelago_requirement";
import { Items } from "../../data/items";
import { SlotdataHandler } from "../slotdata_handler";
import { SkillHandler } from "./skill_handler";
import { NotificationHandler } from "../notification_handler";

let actionSavePrefix = "AP_action_";
let skillSavePrefix = "AP_skill_";

export class ActionHandler{
    private notificationHandler : NotificationHandler;

    protected items : Items;

    protected characterStorage : ModStorage;
    protected skillId : string;
    protected itemType : string;
    
    private apIcon : string;

    constructor(notificationHandler : NotificationHandler, items : Items, apIcon : string, skillId : string, itemType : string){
        this.notificationHandler = notificationHandler;
        
        this.items = items;
        this.skillId = skillId;
        this.itemType = itemType;

        this.characterStorage = {} as ModStorage;

        this.apIcon = apIcon;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockAction(action : BasicSkillRecipe){
    }

    // lockAction(skillId : string, action : BasicSkillRecipe){
    //     let countNeeded = this.items.skill_actions.get(skillId)?.find((element) => element[1] === action.id)?.at(0) as number ?? -1;

    //     if(countNeeded == -1){
    //         countNeeded = 999999;
    //         console.log(`Invalid count needed for ${action.id}.`);
    //     }
    //     else{
    //         countNeeded += 1;
    //     }
        
    //     switch(skillId){
    //         case "melvorD:Woodcutting":
    //             data.itemType = "tree";
    //             // @ts-ignore
    //             game.woodcutting.modifyData({trees: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         case "melvorD:Fishing":
    //             data.itemType = "fish";
    //             // @ts-ignore
    //             game.fishing.modifyData({fish: [{id: action.id, requirements: {add: [ data ]}}]})
    //         case "melvorD:Firemaking":
    //             data.itemType = "log";
    //             // @ts-ignore
    //             game.firemaking.modifyData({logs: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         case "melvorD:Cooking":
    //             data.itemType = "recipe";
    //             // @ts-ignore
    //             game.cooking.modifyData({recipes: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         case "melvorD:Mining":
    //             data.itemType = "rock";
    //             // @ts-ignore
    //             game.mining.modifyData({rockData: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         case "melvorD:Smithing":
    //             data.itemType = "recipe";
    //             // @ts-ignore
    //             game.cooking.modifyData({recipe: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         case "melvorD:Farming":
    //             data.itemType = "seed";
    //             // @ts-ignore
    //             game.farming.modifyData({seeds: [{id: action.id, requirements: {add: [ data ]}}]})
    //             break;
    //         default:
    //             console.log(`Unknown action type ${action.id}.`);
    //             break;
    //         }

    //     this.refreshUI();
    // }
    
    public isActionUnlocked(actionID : string) : boolean{
        return this.characterStorage.getItem(actionSavePrefix + actionID) >= 1;
    }

    public refreshUI() {
    }

    public getProgressiveSkillCount() : number{
        return this.characterStorage.getItem(skillSavePrefix + this.skillId) ?? 0;
    }

    protected createApRequirementData(actionId : string) : ApRequirementData{
        let countNeeded = this.items.skill_actions.get(this.skillId)?.find((element) => element[1] === actionId)?.at(0) as number ?? -1;

        if(countNeeded == -1){
            countNeeded = 999999;
            console.log(`Invalid progressive count for ${actionId}.`);
        }
        else{
            countNeeded += 1;
        }

            return {
            type: "ArchipelagoUnlock", 
            itemId: actionId, 
            itemType: this.itemType,
            skillId: this.skillId,
            isProgressive: true,
            countNeeded: countNeeded,
            items: this.items,
            actionHandler: this,
            notificationHandler: this.notificationHandler,
            iconUrl: this.apIcon
        } as ApRequirementData;
    }
}