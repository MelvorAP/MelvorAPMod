let isArchipelagoGameMode = false;

export async function setup(ctx) {
  ctx.resourceManager = await ctx.loadModule('src/resource_manager.mjs');
  ctx.resourceManager.setup(ctx);
  
  ctx.connectionHandler = await ctx.loadModule('src/connection_handler.mjs');
  ctx.statsHandler = await ctx.loadModule('src/stats_handler.mjs');
  ctx.itemHandler = await ctx.loadModule('src/item_handler.mjs');

  ctx.connectionHandler.setupSettings(ctx);

  ctx.onCharacterLoaded(async ctx => {
		isArchipelagoGameMode = game.currentGamemode._localID == "apGameMode";

    if(!isArchipelagoGameMode){
      setupSettings
      return;
    }

    await ctx.itemHandler.setup(ctx);
    ctx.connectionHandler.setup(ctx);
	})

  ctx.onInterfaceReady(ctx => {
    if(!isArchipelagoGameMode){
      return;
    }

    ctx.itemHandler.lockSkills();
    ctx.itemHandler.loadUnlockedSkills();
  
    ctx.connectionHandler.setConnectionInfo(ctx);
    ctx.connectionHandler.connectToAP(ctx);
  });

  //dumpVals();
}

function dumpVals(){
  dumpMap("Skills", game.skills.registeredObjects);
  dumpMap("Pets", game.pets.registeredObjects);
}

function dumpMap(name, map){
  let iterator = map.entries();

  let message = name + "\n"

  for(let i = 0; i < map.size; i++){
    let v = iterator.next().value

    message += v[0] + " - " + v[1]._localID + " - " + v[1]._name  + "\n"
  }

  console.log(message);
}