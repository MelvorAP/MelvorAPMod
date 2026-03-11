import { ApRequirementData } from "src/ts/ap_classes/archipelago_requirement";
import { ActionSavePrefix, Items, SkillSavePrefix } from "../../../data/items";

export class ActionHandler{
    public skillId : string; 

    protected itemType = "recipe";

    protected items : Items;
    protected characterStorage : ModStorage;
    protected ctx: ModContext;

    protected apIcon : string;

    constructor(ctx: ModContext, items : Items, apIcon : string, skillId : string){
      
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
        // @ts-ignore
        this.ctx.patch(SkillWithMastery, "addMasteryXP").replace(function(o, action : MasteryAction, xp) {
            // @ts-ignore
            let mastery = this.actionMastery.get(action);
            // @ts-ignore
            let masteryCap = action.masteryCap ?? this.masteryLevelCap;
            // @ts-ignore
            if(!mastery || mastery.xp < exp.level_to_xp(masteryCap) ){
                return o(action, xp);
            }
            else{
                mastery.xp = exp.level_to_xp(masteryCap);
                // @ts-ignore
                this.renderQueue.actionMastery.add(action);
                return false;
            }
        });
    }

    lockAction(_action : BasicSkillRecipe){
    }
    
    public isActionUnlocked(actionID : string) : boolean{
        console.warn(ActionSavePrefix + actionID);
        return this.characterStorage.getItem(ActionSavePrefix + actionID) >= 1;
    }

    public refreshUI() {
    }

    public getProgressiveSkillCount() : number{
        return this.characterStorage.getItem(SkillSavePrefix + this.skillId) ?? 0;
    }

    public setLevelRequirementsToLowest(){
        const skill = game.skills.getObjectByID(this.skillId);

        if(skill instanceof SkillWithMastery){
            skill.sortedMasteryActions.forEach(action => {
                action.level = 1;
            })
            this.refreshUI();
        }
    }

    public increaseProgressiveSkillCount() : boolean{
        let saveName = SkillSavePrefix + this.skillId;
        let saveCount = this.getProgressiveSkillCount();

        console.log(`${saveName} count went up from ${saveCount} to ${saveCount +1}`);
        
        this.characterStorage.setItem(saveName, saveCount + 1);
        
        this.refreshUI();
        
        return true;
    }

    protected createApRequirementData(actionId : string) : ApRequirementData{
        let skillAction = this.items.skill_actions.get(this.skillId)?.find((element) => element[1] === actionId);
        let countNeeded = 1;

        if(!skillAction){
            countNeeded = 999999;
            console.log(`Invalid progressive count for ${actionId}.`);
        }
        else{
            countNeeded += skillAction[0] as number;
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
            iconUrl: this.apIcon
        } as ApRequirementData;
    }
}