let connectionHandler = null;

export async function setup(ctx) {
  connectionHandler = await ctx.loadModule('src/connection_handler.mjs');
  connectionHandler.setupSettings(ctx);

  ctx.onInterfaceReady(async ctx => {
    connectionHandler.setConnectionInfo(ctx);
    connectionHandler.ConnectToAP(ctx);
  });
}