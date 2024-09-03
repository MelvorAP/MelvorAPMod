import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_STATUS  } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

const client = new Client();

let itemHandler = null;
let resourceManager = null;

// Set up the connection information.
export const connectionInfo = {
  hostname: "archipelago.gg", // Replace with the actual AP server hostname.
  port: 0, // Replace with the actual AP server port.
  game: "Melvor Idle", // Replace with the game name for this player.
  name: "Player1", // Replace with the player slot name.
  password: "",
  version: {
    major: 0, 
    minor: 5, 
    build: 0
  },
  items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL
};

export function setup(ctx, iHandler, rManager){
  itemHandler = iHandler;
  resourceManager = rManager;

  client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet, message) => {
    console.log("Connected to server: ", packet);
  });
  client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet, message) => {
    if (packet.index == 0) {
      console.log("Sync package");
    }
    else{
      for (let i=  0; i < packet.items.length; i++) {
        let item = packet.items[i]
        
        if (itemHandler.recieveItem(item.item, false))
        {
          let message = "";
          let itemName = client.items.name(connectionInfo.game, item.item);

          if(client.data.slot == item.player){
            message = "Found " + itemName + "!"; 
          }
          else{
            message = "Recieved " + itemName + " from "+ client.players.name(item.player) + "!"; 
          }
          
          game.notifications.createInfoNotification(item.item, message, resourceManager.apLogo, 0)
        }
      }
    }
  });
}

export function setupSettings(ctx){
    const apConnection = ctx.settings.section('Connection');

    apConnection.add({
      type: 'text',
      name: 'ap-hostname',
      label: 'Host name',
      hint: 'Host name of the AP world, for example archipelago.gg',
      default: "archipelago.gg"
    });

    apConnection.add({
      type: 'number',
      name: 'ap-port',
      label: 'Port',
      hint: 'Port of the AP world.',
      default: 0
    });
  
    apConnection.add({
      type: 'text',
      name: 'ap-slotname',
      label: 'Slot name',
      hint: 'Slot name of the player, for example Player1',
      default: "Player1"
    });
  
    apConnection.add({
      type: 'text',
      name: 'ap-password',
      label: 'Password',
      hint: 'Password of the AP room',
      default: ""
    });
}

export function setConnectionInfo(ctx){
  const apConnectionInfo = ctx.settings.section('Connection')

  connectionInfo.hostname = apConnectionInfo.get('ap-hostname');
  connectionInfo.port = Number(apConnectionInfo.get('ap-port'));
  connectionInfo.password = apConnectionInfo.get('ap-password');
  connectionInfo.name = apConnectionInfo.get('ap-slotname');
}

export function connectToAP(ctx, statsHandler){
  console.log("Trying to connect to " + connectionInfo.hostname + ":" + String(connectionInfo.port));

  client
  .connect(connectionInfo)
  .then(() => {
    console.log("Connected to the server as player " + connectionInfo.name);

    statsHandler.setSlotData(ctx, client.data.slotData);

    client.updateStatus(CLIENT_STATUS.PLAYING);
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
    // Handle the connection error.
  });
}