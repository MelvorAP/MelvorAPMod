const skillSavePrefix = "AP_skill_";
const actionSavePrefix = "AP_action_";

let items = null;

let characterStorage = null;

export function setup(ctx, itms){
    items = itms;

    characterStorage = ctx.characterStorage;
}

export function lockSkills(){
    const skills = game.skills.registeredObjects;
    const iterator = skills.values();

    for(let i = 0; i < skills.size; i++){
        let skill = iterator.next().value;

        skill.setUnlock(false);
        
        console.log("Locking skill", skill._localID);

        if(!skill.actions)
        {
            console.log("Skill", skill._localID, "does not have actions.");
            continue;
        }

        //lockActions(skill);
    }
}

export function loadUnlockedSkills(){
    const iterator = items.itemDict.entries();

    for(let i = 0; i < items.itemDict.size; i++){
        const v = iterator.next().value;

        const itemId = v[0];
        const itemName = v[1];

        const saveCount = characterStorage.getItem(skillSavePrefix + itemName)

        if(saveCount){
            for(let i = 0; i < saveCount; i++){
                unlockSkill(itemName);
            }
        }
    }
}

function lockActions(skill){
    let namespaceIterator = skill.actions.namespaceMaps.values();

    for(let j = 0; j < skill.actions.namespaceMaps.size; j++){
        let namespace = namespaceIterator.next().value;
        let actionIterator = namespace.values();

        for(let k = 0; k < namespace.size; k++){
            let action = actionIterator.next().value;
            action.level = 9999;
            
            //TODO custom stuff for Thieving, Farming, Agility, Woodcutting and Alt Magic
            console.log("Locking action", action._localID);
        }
    }
}
  
export function unlockSkill(skillName){
    game.skills.getObjectByID(skillName).setUnlock(true);
    characterStorage.setItem(skillSavePrefix + skillName, 1);
}