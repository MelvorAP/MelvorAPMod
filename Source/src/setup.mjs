// ES module import, but you can use CommonJS syntax as well, if you prefer.
import { Client, ITEMS_HANDLING_FLAGS } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

// Create a new instance of the Client class.
const client = new Client();

let settingsHandler = null;

export async function setup(ctx) {
  settingsHandler = await ctx.loadModule('src/settings_handler.mjs');
  settingsHandler.setupSettings(ctx);

  ctx.onInterfaceReady(async ctx => {
    settingsHandler.setConnectionInfo(ctx);
    ConnectToAP(settingsHandler.connectionInfo);
  });
}

async function ConnectToAP(connectionInfo){
  console.log("Trying to connect to " + connectionInfo.hostname + ":" + String(connectionInfo.port));

  client
  .connect(connectionInfo)
  .then(() => {
    console.log("Connected to the server");
    client.say("Howdy");
    // You are now connected and authenticated to the server. You can add more code here if need be.
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
    // Handle the connection error.
  });
}