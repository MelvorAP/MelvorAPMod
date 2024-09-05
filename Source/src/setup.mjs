const { loadModule } = mod.getContext(import.meta);
const { ArchipelagoRequirement } = await loadModule('src/classes/archipelagoRequirement.mjs');
const { ArchipelagoItemsChangedEvent } = await loadModule('src/classes/archipelagoItemsChangedEvent.mjs');

let isArchipelagoGameMode = false;

export async function setup(ctx) {
  ctx.onModsLoaded(async ctx => {
    ctx.resourceManager = await ctx.loadModule("src/resource_manager.mjs");
    ctx.resourceManager.setup(ctx);
    
    ctx.connectionHandler = await ctx.loadModule("src/connection_handler.mjs");
    ctx.notificationHandler = await ctx.loadModule("src/notification_handler.mjs");
    
    ctx.slotdataHandler = await ctx.loadModule("src/slotdata_handler.mjs");
    ctx.itemHandler = await ctx.loadModule("src/item_handler.mjs");
    ctx.skillHandler = await ctx.loadModule("src/skill_handler.mjs");

    ctx.settingsHandler = await ctx.loadModule("src/settings_manager.mjs");

    ctx.patch(Game, "getRequirementFromData").after(function (requirement, data) {
      if(data.type == "ArchipelagoUnlock")
        return new ArchipelagoRequirement(data, game);
    });
  })

  ctx.onCharacterSelectionLoaded(async ctx => {
    ctx.settingsHandler.setup(ctx);
  })

  ctx.onCharacterLoaded(async ctx => {
		isArchipelagoGameMode = game.currentGamemode._localID == "apGameMode";

    if(!isArchipelagoGameMode){
      setupSettings
      return;
    }

    const items = await ctx.loadModule("src/data/items.mjs");
    items.setup();

    ctx.itemHandler.setup(ctx, items);
    ctx.skillHandler.setup(ctx, items);

    ctx.notificationHandler.setup(ctx)
    ctx.connectionHandler.setup(ctx);

    ctx.skillHandler.lockSkills();

    //ctx.modifyData({trees: [{id: "melvorD:Normal", requirements: {add: [{skillID: "melvorD:Woodcutting", level: 99999}]}}]}) 
	})

  ctx.onInterfaceReady(ctx => {
    if(!isArchipelagoGameMode){
      return;
    }

    ctx.skillHandler.loadUnlockedSkills();
  
    ctx.connectionHandler.setConnectionInfo(ctx);
    ctx.connectionHandler.connectToAP(ctx);

    game.combat.on("monsterKilled", function (e) {console.log("Monster killed:", e)})
    game.combat.on("dungeonCompleted", function (e) {console.log("Dungeon completed:", e)})
    game.combat.on("strongholdCompleted", function (e) {console.log("Dungeon completed:", e)})
    game.combat.on("abyssDepthCompleted", function (e) {console.log("Abyss completed:", e)})

    game.astrology.on("levelChanged", function (e) {console.log(e.skill, "leveled up from", e.oldLevel, " to ", e.newLevel)})
    game.astrology.on("masteryLevelChanged", function (e) {console.log(e.action, "leveled up from", e.oldLevel, " to ", e.newLevel)})

    //ctx.notificationHandler.showApModal("", "");
    //ctx.notificationHandler.showSkillModal("TITLE", "MESSAGE", "attack");

    game.woodcutting.modifyData({trees: [{id: "melvorD:Normal", requirements: {add: [{type: "ArchipelagoUnlock", itemId: "melvorD:Woodcutting", itemType: "tree"}]}}]})
    woodcuttingMenu.treeMenus.get(game.woodcutting.actions.getObjectByID("melvorD:Normal")).setTree(game.woodcutting.actions.getObjectByID("melvorD:Normal"), game.woodcutting);
    //game.test = true;
    game.woodcutting.renderQueue.treeUnlocks = true;
    
  });

  const mapDumper = await ctx.loadModule("src/test/mapDumper.mjs");

  //mapDumper.dumpMap("Skills", game.skills.registeredObjects);
  //mapDumper.dumpMap("Pets", game.pets.registeredObjects);
  //mapDumper.dumpMap("Woodcutting action", game.woodcutting.actions.registeredObjects);  
}