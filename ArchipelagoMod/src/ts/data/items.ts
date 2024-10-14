export class Items{
  private startID = 20201120;

  itemDict = new Map(); 
  
  constructor(){
    for (let i = 0; i < this.all_items.length; i++) {
        let id = this.startID + i;
        let name = this.all_items[i];

        this.itemDict.set(id, name);

        console.log("Item ", name , "is at ID ", id)
      }
      
    console.log("Found ", String(this.itemDict.size), " AP items.");

    console.log(this.itemDict.get(this.startID));
  }

  demo_skill_unlocks = [
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

  demo_progressive_skill_unlocks = [
    "Progressive Woodcutting",
    "Progressive Fishing",
    "Progressive Firemaking",
    "Progressive Cooking",
    "Progressive Mining",
    "Progressive Smithing",
    "Progressive Farming"
  ]

  demo_pets = [
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
    "melvorD:Mac"
  ]

  demo_event_pets = [
    //Event only, just cosmetic
    "melvorD:RipperTheReindeer",
    //Event only, just cosmetic
    "melvorD:FestiveCoolRock",
    //Event only, just cosmetic
    "melvorD:FestiveChio"
  ]

  demo_goblin_raid_pets = [
    //Golbin Raid Shop
    "melvorD:JerryTheGiraffe",
    //Golbin Raid Shop
    "melvorD:PrestonThePlatypus",
  ]

  all_items = [
    ...this.demo_skill_unlocks,
    ...this.demo_progressive_skill_unlocks,
    ...this.demo_pets,
    ...this.demo_event_pets,
    ...this.demo_goblin_raid_pets
  ]

  skills = [
    ...this.demo_skill_unlocks,
  ]

  pets = [
    ...this.demo_pets,
    ...this.demo_event_pets,
    ...this.demo_goblin_raid_pets
  ]

  progressive_skills = new Map([
    [20201130, "melvorD:Woodcutting"],
    [20201131, "melvorD:Fishing"],
    [20201132, "melvorD:Firemaking"],
    [20201133, "melvorD:Cooking"],
    [20201134, "melvorD:Mining"],
    [20201135, "melvorD:Smithing"],
    [20201136, "melvorD:Farming"],
  ])

  skill_actions = new Map([
    ["melvorD:Woodcutting", [
      "melvorD:Normal",
      "melvorD:Oak",
      "melvorD:Willow",
      "melvorD:Teak",
      "melvorD:Maple"
    ]]
  ])
}