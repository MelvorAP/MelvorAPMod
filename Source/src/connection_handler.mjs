import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_STATUS, CLIENT_PACKET_TYPE } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

const client = new Client();

let itemHandler = null;
let notificationHandler = null;
let slotdataHandler = null;

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
  itemHandler = ctx.itemHandler;
  notificationHandler = ctx.notificationHandler;
  slotdataHandler = ctx.slotdataHandler;

  client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => handleMessages(packet));
  client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet, message) => handleItems(packet));
  client.addListener(SERVER_PACKET_TYPE.DEATH_LINK, (packet, message) => handleDeathLink(packet));
}

export function setConnectionInfo(ctx){
  const apConnectionInfo = ctx.settings.section("Connection")

  connectionInfo.hostname = apConnectionInfo.get("ap-hostname");
  connectionInfo.port = Number(apConnectionInfo.get("ap-port"));
  connectionInfo.password = apConnectionInfo.get("ap-password");
  connectionInfo.name = apConnectionInfo.get("ap-slotname");
}

export function connectToAP(ctx){
  notificationHandler.SendApNotification(-1, "Trying to connect to AP World.", false, true);

  client
  .connect(connectionInfo)
  .then(() => {
    notificationHandler.SendApNotification(-1, "Connected to AP World as player " + connectionInfo.name + "!", true, true);

    slotdataHandler.setSlotData(client.data.slotData);

    client.updateStatus(CLIENT_STATUS.PLAYING);
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
    notificationHandler.SendErrorNotification(-1, "Failed to connect to AP World!", true);
  });
}

function handleMessages(packet){
  console.log("Received JSON", packet);
  
  switch(packet.type){
    case "Chat":
    case "ServerChat":
      notificationHandler.SendApNotification(-1, packet.data[0].text, false, true);
      break;
      case "Join":
        const text = packet.data[0].text.split(".")[0];
        const playerName = text.split(" ")[0];

        if(GetCurrentPlayerName() != playerName){
          notificationHandler.SendApNotification(-1, text, false, true);
        }
        break;
    case "Tutorial":
      //Do nothing
      break;
    default:
      console.log("Unhandled message type");
  }
}

function handleItems(packet){
    if (packet.index == 0) {
      //Sync package

      let lastRecievedItemIndex = itemHandler.lastRecievedItemIndex;

      if(lastRecievedItemIndex == -1){
        lastRecievedItemIndex = 0;
      }

      for(let i = lastRecievedItemIndex; i < packet.items.length; i++){
        let item = packet.items[i]

        handleReceivedItem(item.item, item.player);
      }

      itemHandler.updateItemIndex(packet.items.length);
    }
    else{
      for (let i = 0; i < packet.items.length; i++) {
        let item = packet.items[i]

        handleReceivedItem(item.item, item.player);
      }
    }
}

function handleReceivedItem(id, player){
  if (itemHandler.receiveItem(id))
    {
      let message = "";
      let itemName = client.items.name(connectionInfo.game, id);

      if(GetCurrentPlayerId() == player){
        message = "Found " + itemName + "!"; 
      }
      else{
        message = "Recieved " + itemName + " from "+ client.players.name(player) + "!"; 
      }
      
      notificationHandler.SendApNotification(id, message, true, true);
    }
}

function handleDeathLink(packet){
  game.combat.player.hitpoints = 0;
}

function GetCurrentPlayerId(){
  return client.data.slot;
}

function GetCurrentPlayerName(){
  return client.players.name(GetCurrentPlayerId());
}