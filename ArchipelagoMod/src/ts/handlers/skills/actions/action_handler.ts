import { ApRequirementData } from "../../../ap_classes/archipelago_requirement";
import { ActionSavePrefix, Items, Namespace, SkillSavePrefix } from "../../../data/items";

export class ActionHandler{
    public skillId : string; 

    protected itemType = "recipe";

    protected items : Items;
    protected characterStorage : ModStorage;
    protected ctx: ModContext;

    protected apIcon : string;

    protected actionRequirements = new Map<string, number>();

    constructor(ctx: ModContext, items : Items, apIcon : string, skillId : string){
      
        this.items = items;
        this.characterStorage = {} as ModStorage;
        this.ctx = ctx;

        this.skillId = skillId;
        this.apIcon = apIcon;

        this.setActionRequirements();
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

    protected setActionRequirements(){
        let skill = game.skills.getObjectByID(this.skillId);
        let countNeeded = 0;

        if(skill instanceof SkillWithMastery){
            for(let j = 0; j < skill.actions.size; j++){
                let action = skill.actions.allObjects[j];
                if(action instanceof MasteryAction){
                    const actionNamespace = Namespace[action.namespace as keyof typeof Namespace];
                    if(!actionNamespace){
                        continue;
                    }
                    
                    countNeeded += 1;
                    this.actionRequirements.set(action.id, countNeeded);
                    console.warn(`${action.id} is unlocked at ${countNeeded}`);
                }
            }
        }
    }

    protected createApRequirementData(actionId : string) : ApRequirementData{
        let countNeeded = this.actionRequirements.get(actionId);

        if(!countNeeded){
            countNeeded = 999999;
            console.log(`Invalid progressive count for ${actionId}.`);
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