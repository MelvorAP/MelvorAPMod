import { ApRequirementData } from "src/ts/ap_classes/archipelago_requirement";
import { Items } from "../../../data/items";
import { SlotdataHandler } from "../../slotdata_handler";
import { SkillHandler } from "../skill_handler";
import { NotificationHandler } from "../../notification_handler";

export class ActionHandler{
    private notificationHandler : NotificationHandler;

    protected items : Items;
    protected characterStorage : ModStorage;
    protected ctx: ModContext;

    protected skillId : string; 
    protected apIcon : string;

    constructor(ctx: ModContext, notificationHandler : NotificationHandler, items : Items, apIcon : string, skillId : string){
        this.notificationHandler = notificationHandler;
        
        this.items = items;
        this.characterStorage = {} as ModStorage;
        this.ctx = ctx;

        this.skillId = skillId;
        this.apIcon = apIcon;
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    patchSkill(){
        
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
        console.warn(Items.actionSavePrefix + actionID);
        return this.characterStorage.getItem(Items.actionSavePrefix + actionID) >= 1;
    }

    public refreshUI() {
    }

    public getProgressiveSkillCount() : number{
        return this.characterStorage.getItem(Items.skillSavePrefix + this.skillId) ?? 0;
    }

    public setLevelsToLowest(){
        const skill = game.skills.getObjectByID(this.skillId);

        if(skill instanceof SkillWithMastery){
            skill.sortedMasteryActions.forEach(action => {
                action.level = 1;
            })
            this.refreshUI();
        }
    }

    public increaseProgressiveSkillCount() : boolean{
        let saveName = Items.skillSavePrefix + this.skillId;
        let saveCount = this.getProgressiveSkillCount();

        console.log(`${saveName} count went up from ${saveCount} to ${saveCount +1}`);
        
        this.characterStorage.setItem(saveName, saveCount + 1);
        
        this.refreshUI();
        
        return true;
    }

    protected createApRequirementData(actionId : string, itemType : string) : ApRequirementData{
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
            itemType: itemType,
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