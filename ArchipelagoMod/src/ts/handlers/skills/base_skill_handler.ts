import { ProgressiveRequirementData, ProgressiveSkillRequirementType } from "./requirements/progressive_skill_requirement";
import { ActionPrefix, Items, ItemType, SkillCapPrefix, SkillPrefix } from "../../data/items";
import { ApSkillItemReceivedType, ArchipelagoSkillItemReceivedEventMatcher } from "../../events/archipelago_event_matchers";
import { SkillItemReceivedEvent } from "../../events/archipelago_events";
import { MasteryMult, NamespaceEnum } from "../../data/general";
import { LocationHandler } from "../location_handler";
import { LocationType } from "../../data/locations";

export class BaseSkillHandler {
    public skillId : string; 

    protected itemType = "recipe";

    protected items : Items;
    protected characterStorage : ModStorage;
    protected ctx: ModContext;

    protected apIcon : string;

    protected matcher : GameEventMatcher | undefined;

    protected actionRequirements = new Map<string, number>();

    constructor(ctx: ModContext, items : Items, apIcon : string, skillId : string){
        this.items = items;
        this.characterStorage = {} as ModStorage;
        this.ctx = ctx;

        this.skillId = skillId;
        this.apIcon = apIcon;

        this.setActionRequirements();

        let skill = game.skills.getObjectByID(this.skillId);

        //They for loop so all levels inbetween get sent, when multiple levels go up at once
        if(skill instanceof SkillWithMastery)
        {
            //@ts-ignore
            skill.on("levelChanged", function (e) {
                //@ts-ignore
                console.log(`${skill.name} leveled up from ${e.oldLevel} to ${e.newLevel}`);
                for(let i = e.oldLevel +1; i <= e.newLevel; i++){
                    //@ts-ignore
                    game.locationHandler.sendLocation(skill.id, LocationType.SkillLevelup, skill.namespace, i -2);
                }
            })

            //@ts-ignore
            skill.on("masteryLevelChanged", function (e) {
                console.log(`${e.action.name} leveled up from ${e.oldLevel} to ${e.newLevel}`);
                let actionIndex = skill.actions.allObjects.indexOf(e.action);

                for(let i = e.oldLevel +1; i <= e.newLevel; i++){
                    //@ts-ignore
                    game.locationHandler.sendLocation(skill.id, LocationType.MasteryLevelUp, e.action.namespace, actionIndex * MasteryMult + e.newLevel -2);
                }
            })
        }
    }

    public initialize(){
        let data = {
            type : ApSkillItemReceivedType,
            skillId : this.skillId
        }
        
        //@ts-ignore
        this.matcher = game.events.constructMatcher(data) as ArchipelagoSkillItemReceivedEventMatcher;

        //@ts-ignore
        this.matcher.assignHandler((e : SkillItemReceivedEvent ) => {
            if(e.skillId == this.skillId){
                switch (e.itemType){
                    case ItemType.ProgressiveSkills:
                        this.unlockSkill();
                        this.increaseProgressiveSkillCount();
                        break;
                    case ItemType.SkillLevelCaps:
                        this.increaseCap();
                        break;
                    default:
                        console.log(`Unknown item type ${e.itemId} for ${this.skillId}`);
                        break;
                }
            }
        })
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
        console.warn(ActionPrefix + actionID);
        return this.characterStorage.getItem(ActionPrefix + actionID) >= 1;
    }

    public refreshUI() {
    }

    public getProgressiveSkillCount() : number{
        return this.characterStorage.getItem(SkillPrefix + this.skillId) ?? 0;
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

    unlockSkill(){
        let skill = game.skills.getObjectByID(this.skillId);

        if(skill){
            skill.setUnlock(true);
        }
    }
    

    public increaseProgressiveSkillCount() : boolean{
        let saveName = SkillPrefix + this.skillId;
        let saveCount = this.getProgressiveSkillCount();

        console.log(`${saveName} count went up from ${saveCount} to ${saveCount +1}`);
        
        this.characterStorage.setItem(saveName, saveCount + 1);
        
        this.refreshUI();
        
        return true;
    }

    increaseCap(){
        let skill = game.skills.getObjectByID(this.skillId);

        let cap = (this.characterStorage.getItem(SkillCapPrefix + this.skillId) ?? 1) + 1;

        // @ts-ignore
        if(cap > skill.maxLevelCap){
            // @ts-ignore
            console.warn(`Skill ${this.skillId} is already at level cap of ${skill.maxLevelCap}!`)
        }
        else{   
            this.characterStorage.setItem(SkillCapPrefix + this.skillId, cap);

            console.log(`Skill ${this.skillId} level cap went up from ${cap -1} to ${cap}`);

            // @ts-ignore
            skill.setLevelCap(cap);
        }
    }

    increaseCapToMax(){
        let skill = game.skills.getObjectByID(this.skillId);

        // @ts-ignore
        let cap = skill.maxLevelCap as number;
        
        this.characterStorage.setItem(SkillCapPrefix + this.skillId, cap);

        console.log(`Skill ${this.skillId} level cap went up to ${cap}`);

        // @ts-ignore
        skill.setLevelCap(cap);
        // @ts-ignore
    }

    protected setActionRequirements(){
        let skill = game.skills.getObjectByID(this.skillId);
        let countNeeded = 0;

        if(skill instanceof SkillWithMastery){
            for(let j = 0; j < skill.actions.size; j++){
                let action = skill.actions.allObjects[j];
                if(action instanceof MasteryAction){
                    const actionNamespace = NamespaceEnum[action.namespace as keyof typeof NamespaceEnum];
                    if(!actionNamespace){
                        continue;
                    }
                    
                    countNeeded += 1;
                    this.actionRequirements.set(action.id, countNeeded);
                    //console.warn(`${action.id} is unlocked at ${countNeeded}`);
                }
            }
        }
    }

    protected createApRequirementData(actionId : string) : ProgressiveRequirementData{
        let countNeeded = this.actionRequirements.get(actionId);

        if(!countNeeded){
            countNeeded = 999999;
            console.log(`Invalid progressive count for ${actionId}.`);
        }

        return {
            type: ProgressiveSkillRequirementType,
            itemId: actionId, 
            itemType: this.itemType,
            skillId: this.skillId,
            countNeeded: countNeeded,
            iconUrl: this.apIcon,
            actionHandler: this
        } as ProgressiveRequirementData;
    }
}