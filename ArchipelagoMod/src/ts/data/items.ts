export class Items{
  private startID = 20201120;

  itemDict = new Map(); 

  allItems = [
    "melvorD:Attack",
    "melvorD:Strength",
    "melvorD:Defence",
    "melvorD:Hitpoints",
    "melvorD:Ranged",
    "melvorD:Magic",
    "melvorD:Prayer",
    "melvorD:Slayer",
    "melvorD:Woodcutting",
    "melvorD:Fishing",
    "melvorD:Firemaking",
    "melvorD:Cooking",
    "melvorD:Mining",
    "melvorD:Smithing",
    "melvorD:Thieving",
    "melvorD:Farming",
    "melvorD:Fletching",
    "melvorD:Crafting",
    "melvorD:Runecrafting",
    "melvorD:Herblore",
    "melvorD:Agility",
    "melvorD:Summoning",
    "melvorD:Astrology",
    "melvorD:Township",
    "melvorD:Beavis",
    "melvorD:PuddingDuckie",
    "melvorD:Pyro",
    "melvorD:Cris",
    "melvorD:CoolRock",
    "melvorD:PuffTheBabyDragon",
    "melvorD:LarryTheLonelyLizard",
    "melvorD:Bruce",
    "melvorD:LilRon",
    "melvorD:Leonardo",
    "melvorD:FinnTheCat",
    "melvorD:GoldenGolbin",
    "melvorD:Ty",
    "melvorD:Chick",
    "melvorD:Zarrah",
    "melvorD:Chio",
    "melvorD:BouncingBob",
    "melvorD:Rosey",
    "melvorD:Ayyden",
    "melvorD:ArcticYeti",
    "melvorD:Mac",
    "melvorD:JerryTheGiraffe",
    "melvorD:PrestonThePlatypus",
    "melvorF:Snek",
    "melvorF:Quill",
    "melvorF:Caaarrrlll",
    "melvorF:Gunter",
    "melvorF:Gronk",
    "melvorF:Marahute",
    "melvorF:Salem",
    "melvorF:Monkey",
    "melvorF:Asura",
    "melvorF:Peri",
    "melvorF:Otto",
    "melvorF:JellyJim",
    "melvorF:Harley",
    "melvorF:Singe",
    "melvorF:Aquarias",
    "melvorF:Norman",
    "melvorF:Erran",
    "melvorF:Ren",
    "melvorF:Pablo",
    "melvorF:Sam",
    "melvorF:TimTheWolf",
    "melvorF:Mark",
    "melvorF:Bone",
    "melvorF:Astro",
    "melvorF:B",
    "melvorF:Marcy",
    "melvorF:Roger",
    "melvorF:Ace",
    "melvorF:Layla",
    "melvorF:MisterFuzzbutt",
    "melvorF:OctaviusLepidus",
    "melvorF:Saki",
    "melvorF:UndeadStronghold",
    "melvorF:MagicStronghold",
    "melvorF:DragonStronghold",
    "melvorF:GodStronghold",
    "melvorD:RipperTheReindeer",
    "melvorD:FestiveCoolRock",
    "melvorD:FestiveChio",
    "melvorD:JerryTheGiraffe",
    "melvorD:PrestonThePlatypus",
  ]

  skills = [
    "melvorD:Attack",
    "melvorD:Strength",
    "melvorD:Defence",
    "melvorD:Hitpoints",
    "melvorD:Ranged",
    "melvorD:Magic",
    "melvorD:Prayer",
    "melvorD:Slayer",
    "melvorD:Woodcutting",
    "melvorD:Fishing",
    "melvorD:Firemaking",
    "melvorD:Cooking",
    "melvorD:Mining",
    "melvorD:Smithing",
    "melvorD:Thieving",
    "melvorD:Farming",
    "melvorD:Fletching",
    "melvorD:Crafting",
    "melvorD:Runecrafting",
    "melvorD:Herblore",
    "melvorD:Agility",
    "melvorD:Summoning",
    "melvorD:Astrology",
    "melvorD:Township",
  ]

  pets = [
    "melvorD:Beavis",
    "melvorD:PuddingDuckie",
    "melvorD:Pyro",
    "melvorD:Cris",
    "melvorD:CoolRock",
    "melvorD:PuffTheBabyDragon",
    "melvorD:LarryTheLonelyLizard",
    "melvorD:Bruce",
    "melvorD:LilRon",
    "melvorD:Leonardo",
    "melvorD:FinnTheCat",
    "melvorD:GoldenGolbin",
    "melvorD:Ty",
    "melvorD:Chick",
    "melvorD:Zarrah",
    "melvorD:Chio",
    "melvorD:BouncingBob",
    "melvorD:Rosey",
    "melvorD:Ayyden",
    "melvorD:ArcticYeti",
    "melvorD:Mac",
    "melvorF:Snek",
    "melvorF:Quill",
    "melvorF:Caaarrrlll",
    "melvorF:Gunter",
    "melvorF:Gronk",
    "melvorF:Marahute",
    "melvorF:Salem",
    "melvorF:Monkey",
    "melvorF:Asura",
    "melvorF:Peri",
    "melvorF:Otto",
    "melvorF:JellyJim",
    "melvorF:Harley",
    "melvorF:Singe",
    "melvorF:Aquarias",
    "melvorF:Norman",
    "melvorF:Erran",
    "melvorF:Ren",
    "melvorF:Pablo",
    "melvorF:Sam",
    "melvorF:TimTheWolf",
    "melvorF:Mark",
    "melvorF:Bone",
    "melvorF:Astro",
    "melvorF:B",
    "melvorF:Marcy",
    "melvorF:Roger",
    "melvorF:Ace",
    "melvorF:Layla",
    "melvorF:MisterFuzzbutt",
    "melvorF:OctaviusLepidus",
    "melvorF:Saki",
    "melvorF:UndeadStronghold",
    "melvorF:MagicStronghold",
    "melvorF:DragonStronghold",
    "melvorF:GodStronghold"
  ]

  eventPets= [
    "melvorD:RipperTheReindeer",
    "melvorD:FestiveCoolRock",
    "melvorD:FestiveChio"
  ]

  goblinRaidPets= [
    "melvorD:JerryTheGiraffe",
    "melvorD:PrestonThePlatypus",
  ]

  demoItems= [
    "melvorD:Attack",
    "melvorD:Strength",
    "melvorD:Defence",
    "melvorD:Hitpoints",
    "melvorD:Woodcutting",
    "melvorD:Fishing",
    "melvorD:Firemaking",
    "melvorD:Cooking",
    "melvorD:Mining",
    "melvorD:Smithing",
    "melvorD:Farming"
  ]

  skillActions= [
    "Progressive Woodcutting",
    "melvorD:Normal"
  ]

  setup(){
    for (let i = 0; i < allItems.length; i++) {
        let id = this.startID + i;
        let name = this.allItems[i]

        this.itemDict.set(id, name);

        console.log("Item ", name , "is at ID ", id)
      }
      
    console.log("Found ", String(this.itemDict.size), " AP items.")
    console.log("Found ", String(this.skills.length), " skills.")
    console.log("Found ", String(this.pets.length + this.eventPets.length), " pets.")
  }
    
}