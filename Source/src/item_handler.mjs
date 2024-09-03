let items = null;
let skillHandler = null;

let characterStorage = null;

const ApItemSavePrefix = "ApItem_"

export async function setup(ctx, sHandler){
    skillHandler = sHandler;
    characterStorage = ctx.characterStorage;

    items = await ctx.loadModule('src/data/items.mjs');
    items.setup();
}

export function loadSaveItems(){
    const iterator = items.itemDict.entries();

    for(let i = 0; i < items.itemDict.size; i++){
        const v = iterator.next().value;

        const itemId = v[0];
        const itemName = v[1];

        const saveCount = characterStorage.getItem(ApItemSavePrefix + itemName)

        if(saveCount){
            for(let i = 0; i < saveCount; i++){
                recieveItem(itemId, true);
            }
        }
    }
}

function SaveItem(itemName){
    const saveName = ApItemSavePrefix + itemName;
    const existingValue = characterStorage.getItem(saveName)

    if(existingValue){
        const newVal = existingValue + 1;

        characterStorage.setItem(saveName, newVal);
        console.log("Increased save item ", saveName, " to ", newVal);
    }
    else{
      characterStorage.setItem(saveName, 1);
      console.log("New save item ", saveName);
    }
  }

export function recieveItem(id, skipSaveToFile){
    const itemName = items.itemDict.get(id);
    let saveToFile = false;

    switch(itemName) {
        case "melvorD:Attack":
        case "melvorD:Strength":
        case "melvorD:Defence":
        case "melvorD:Hitpoints":
        case "melvorD:Ranged":
        case "melvorD:Magic":
        case "melvorD:Prayer":
        case "melvorD:Slayer":
        case "melvorD:Woodcutting":
        case "melvorD:Fishing":
        case "melvorD:Firemaking":
        case "melvorD:Cooking":
        case "melvorD:Mining":
        case "melvorD:Smithing":
        case "melvorD:Thieving":
        case "melvorD:Farming":
        case "melvorD:Fletching":
        case "melvorD:Crafting":
        case "melvorD:Runecraft":
        case "melvorD:Herblore":
        case "melvorD:Agility":
        case "melvorD:Summoning":
        case "melvorD:Astrology":
        case "melvorD:Township":
            skillHandler.unlockSkill(itemName);
            saveToFile = true;
          break;
        default:
            console.error("Unimplemented item: " + itemName);
            return false;
      } 

      if(!skipSaveToFile && saveToFile){
        SaveItem(itemName);
      }

      return true;
  }