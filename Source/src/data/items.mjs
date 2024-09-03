const startID = 20201120;

export const itemDict = new Map(); 
export const skillArr = []; 
export const petArr = []; 

export function setup(){
    const splitIds = itemNames.split(/\r?\n/)

    for (let i = 1; i < splitIds.length -1; i++) {
        let id = startID + i -1;
        let name = splitIds[i]

        itemDict.set(id, name);

        console.log("Item ", name , "is at ID ", id)
      }
      
    skillNames.split(/\r?\n/).forEach(item => {
      skillArr.push(item)
    })
    
    petNames.split(/\r?\n/).forEach(item => {
      petArr.push(item)
    })
      
    console.log("Found " + String(itemDict.size) + " AP items.")
    console.log("Found " + String(skillArr.length) + " skills.")
    console.log("Found " + String(petArr.length) + " pets.")
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
melvorD:Firemaking
melvorD:Cooking
melvorD:Mining
melvorD:Smithing
melvorD:Thieving
melvorD:Farming
melvorD:Fletching
melvorD:Crafting
melvorD:Runecrafting
melvorD:Herblore
melvorD:Agility
melvorD:Summoning
melvorD:Astrology
melvorD:Township
melvorD:Beavis
melvorD:PuddingDuckie
melvorD:Pyro
melvorD:Cris
melvorD:CoolRock
melvorD:PuffTheBabyDragon
melvorD:LarryTheLonelyLizard
melvorD:Bruce
melvorD:LilRon
melvorD:Leonardo
melvorD:FinnTheCat
melvorD:GoldenGolbin
melvorD:Ty
melvorD:RipperTheReindeer
melvorD:Chick
melvorD:Zarrah
melvorD:Chio
melvorD:BouncingBob
melvorD:Rosey
melvorD:Ayyden
melvorD:ArcticYeti
melvorD:Mac
melvorD:JerryTheGiraffe
melvorD:PrestonThePlatypus
melvorD:FestiveCoolRock
melvorD:FestiveChio
melvorF:Snek
melvorF:Quill
melvorF:Caaarrrlll
melvorF:Gunter
melvorF:Gronk
melvorF:Marahute
melvorF:Salem
melvorF:Monkey
melvorF:Asura
melvorF:Peri
melvorF:Otto
melvorF:JellyJim
melvorF:Harley
melvorF:Singe
melvorF:Aquarias
melvorF:Norman
melvorF:Erran
melvorF:Ren
melvorF:Pablo
melvorF:Sam
melvorF:TimTheWolf
melvorF:Mark
melvorF:Bone
melvorF:Astro
melvorF:B
melvorF:Marcy
melvorF:Roger
melvorF:Ace
melvorF:Layla
melvorF:MisterFuzzbutt
melvorF:OctaviusLepidus
melvorF:Saki
melvorF:UndeadStronghold
melvorF:MagicStronghold
melvorF:DragonStronghold
melvorF:GodStronghold
`

const skillNames=`
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
melvorD:Firemaking
melvorD:Cooking
melvorD:Mining
melvorD:Smithing
melvorD:Thieving
melvorD:Farming
melvorD:Fletching
melvorD:Crafting
melvorD:Runecrafting
melvorD:Herblore
melvorD:Agility
melvorD:Summoning
melvorD:Astrology
melvorD:Township
`

const petNames=`
melvorD:Beavis
melvorD:PuddingDuckie
melvorD:Pyro
melvorD:Cris
melvorD:CoolRock
melvorD:PuffTheBabyDragon
melvorD:LarryTheLonelyLizard
melvorD:Bruce
melvorD:LilRon
melvorD:Leonardo
melvorD:FinnTheCat
melvorD:GoldenGolbin
melvorD:Ty
melvorD:RipperTheReindeer
melvorD:Chick
melvorD:Zarrah
melvorD:Chio
melvorD:BouncingBob
melvorD:Rosey
melvorD:Ayyden
melvorD:ArcticYeti
melvorD:Mac
melvorD:JerryTheGiraffe
melvorD:PrestonThePlatypus
melvorD:FestiveCoolRock
melvorD:FestiveChio
melvorF:Snek
melvorF:Quill
melvorF:Caaarrrlll
melvorF:Gunter
melvorF:Gronk
melvorF:Marahute
melvorF:Salem
melvorF:Monkey
melvorF:Asura
melvorF:Peri
melvorF:Otto
melvorF:JellyJim
melvorF:Harley
melvorF:Singe
melvorF:Aquarias
melvorF:Norman
melvorF:Erran
melvorF:Ren
melvorF:Pablo
melvorF:Sam
melvorF:TimTheWolf
melvorF:Mark
melvorF:Bone
melvorF:Astro
melvorF:B
melvorF:Marcy
melvorF:Roger
melvorF:Ace
melvorF:Layla
melvorF:MisterFuzzbutt
melvorF:OctaviusLepidus
melvorF:Saki
melvorF:UndeadStronghold
melvorF:MagicStronghold
melvorF:DragonStronghold
melvorF:GodStronghold
`