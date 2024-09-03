const startID = 20201120;

export const itemDict = new Map(); 

export function setup(){
    const splitIds = itemNames.split(/\r?\n/)

    for (let i = 1; i < splitIds.length -1; i++) {
        let id = startID + i -1;
        let name = splitIds[i]

        itemDict.set(id, name);

        console.log("Item ", name , "is at ID ", id)
      }

    console.log("Found " + String(splitIds.length -1) + " AP items.")
}

const itemNames = `
melvorD:Attack
melvorD:Strength
melvorD:Defence
melvorD:Hitpoints
melvorD:Ranged
melvorD:Magic
melvorD:Prayer
melvorD:Slayer
melvorD:Woodcutting
melvorD:Fishing
melvorD:Fire Making
melvorD:Cooking
melvorD:Mining
melvorD:Smithing
melvorD:Thieving
melvorD:Farming
melvorD:Fletching
melvorD:Crafting
melvorD:Rune Crafting
melvorD:Herblore
melvorD:Agility
melvorD:Summoning
melvorD:Astrology
melvorD:Township
`