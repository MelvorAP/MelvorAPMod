let resourceManager = null;

let connectionHandler = null;
let statsHandler = null;
let skillHandler = null;
let itemHandler = null;



export async function setup(ctx) {
  resourceManager = await ctx.loadModule('src/resource_manager.mjs');
  resourceManager.setup(ctx);
  
  connectionHandler = await ctx.loadModule('src/connection_handler.mjs');
  statsHandler = await ctx.loadModule('src/stats_handler.mjs');
  skillHandler = await ctx.loadModule('src/skill_handler.mjs');
  itemHandler = await ctx.loadModule('src/item_handler.mjs');

  await itemHandler.setup(ctx, skillHandler);

  connectionHandler.setup(ctx, itemHandler, resourceManager);
  connectionHandler.setupSettings(ctx);

  ctx.onCharacterLoaded(() => {
    skillHandler.lockSkills();
  });

  ctx.onInterfaceReady(ctx => {
    connectionHandler.setConnectionInfo(ctx);
    connectionHandler.connectToAP(ctx, statsHandler);

    itemHandler.loadSaveItems();
  });
}