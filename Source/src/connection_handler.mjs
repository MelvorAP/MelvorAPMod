import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_STATUS  } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

const client = new Client();

let context;

// Set up the connection information.
export const connectionInfo = {
  hostname: "archipelago.gg", // Replace with the actual AP server hostname.
  port: 1, // Replace with the actual AP server port.
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

export function setup(ctx){
  context = ctx;

  client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet, message) => {
    console.log("Connected to server: ", packet);
  });
  client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet, message) => {
    if (packet.index == 0) {
      //Sync package

      let lastRecievedItemIndex = context.itemHandler.lastRecievedItemIndex;

      console.log("packet ", packet);
      console.log("lastRecievedItemIndex ", lastRecievedItemIndex);

      if(lastRecievedItemIndex == -1){
        lastRecievedItemIndex = 0;
      }

      for(let i = lastRecievedItemIndex; i < packet.items.length; i++){
        let item = packet.items[i]

        handleReceivedItem(item.item, item.player);
      }

      context.itemHandler.updateItemIndex(packet.items.length);
    }
    else{
      for (let i = 0; i < packet.items.length; i++) {
        let item = packet.items[i]

        handleReceivedItem(item.item, item.player);
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
      hint: 'Port of the AP world',
      default: 1,
      min: 1,
      max: 65535
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

export function connectToAP(ctx){
  console.log("Trying to connect to " + connectionInfo.hostname + ":" + String(connectionInfo.port));

  client
  .connect(connectionInfo)
  .then(() => {
    console.log("Connected to the server as player " + connectionInfo.name);

    ctx.statsHandler.setSlotData(ctx, client.data.slotData);

    client.updateStatus(CLIENT_STATUS.PLAYING);
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
    // Handle the connection error.
  });
}

function handleReceivedItem(id, player){
  if (context.itemHandler.receiveItem(id))
    {
      let message = "";
      let itemName = client.items.name(connectionInfo.game, id);

      if(client.data.slot == player){
        message = "Found " + itemName + "!"; 
      }
      else{
        message = "Recieved " + itemName + " from "+ client.players.name(player) + "!"; 
      }
      
      game.notifications.createInfoNotification(id, message, context.resourceManager.apLogo, 0)
    }
}