// @ts-ignore Import module
import { Client, ITEMS_HANDLING_FLAGS, SERVER_PACKET_TYPE, CLIENT_STATUS, CLIENT_PACKET_TYPE } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

import { SettingsManager } from "../settings_manager";

import { ItemHandler } from "./item_handler";
import { NotificationHandler } from "./notification_handler";
import { SlotdataHandler } from "./slotdata_handler";
import ModService from "../mod_service";

export interface Version {
  major: Number, 
  minor: Number, 
  build: Number
};

// Set up the connection information.
export interface ConnectionInfo{
  hostname: string;
  port: Number;
  game: string;
  name: string;
  password: string;
  version: Version;
  items_handling: ITEMS_HANDLING_FLAGS;
}

export class ConnectionHandler{
  public isConnected : boolean;
  public modService : ModService;

  private connectionInfo : ConnectionInfo = {} as ConnectionInfo;

  private itemHandler : ItemHandler;
  private notificationHandler : NotificationHandler;
  private slotdataHandler : SlotdataHandler;

  private client : Client;

  constructor(modService : ModService, itemHandler: ItemHandler, notificationHandler: NotificationHandler, slotdataHandler: SlotdataHandler){
    this.modService = modService;
    
    this.isConnected = false;
    
    this.connectionInfo = {
      hostname: "archipelago.gg",
      port: 1,
      game: "Melvor Idle",
      name: "Player1",
      password: "",
      version: {
        major: 0, 
        minor: 5, 
        build: 0
      },
      items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL
    }

    this.itemHandler = itemHandler;
    this.notificationHandler = notificationHandler;
    this.slotdataHandler = slotdataHandler;

    this.client = new Client();

    this.client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet : any, _message : string) => this.handleMessages(packet));
    this.client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet : any, _message: string) => this.handleItems(packet));
    this.client.addListener(SERVER_PACKET_TYPE.DEATH_LINK, (packet : any, _message: string) => this.handleDeathLink(packet));
    this.client.addListener(SERVER_PACKET_TYPE.DISCONNECTED, (packet : any, _message: string) => this.diconnected());
  }

  public setConnectionInfo(settingsManager : SettingsManager){
    var apConnectionInfo = settingsManager.apConnectionSection;

    this.connectionInfo.hostname = String(apConnectionInfo.get("ap-hostname"));
    this.connectionInfo.port = Number(apConnectionInfo.get("ap-port"));
    this.connectionInfo.password = String(apConnectionInfo.get("ap-password"));
    this.connectionInfo.name = String(apConnectionInfo.get("ap-slotname"));
  }
  connectToAP(){
    this.notificationHandler.sendApNotification(-1, "Trying to connect to AP World.", false, true);

    this.client
    .connect(this.connectionInfo)
    .then(() => {
      this.slotdataHandler.setSlotData(this.client.data.slotData);

      this.notificationHandler.sendApNotification(-1, "Connected to AP World as player " + this.connectionInfo.name + "!", true, true);
      this.client.updateStatus(CLIENT_STATUS.PLAYING);

      this.isConnected = true;
      this.modService.onConnected();
    })
    .catch((error : any) => {
      console.error("Failed to connect:", error);
      this.notificationHandler.sendErrorNotification(-1, "Failed to connect to AP World!", true);
    });
  }

  disconnect(){
    this.client.disconnect();
    this.diconnected();
  }

  handleMessages(packet : any){
    //console.log("Received JSON", packet);
    
    switch(packet.type){
      case "Chat":
      case "ServerChat":
        this.notificationHandler.sendApNotification(-1, packet.data[0].text, false, true);
        break;
        case "Join":
          const text = packet.data[0].text.split(".")[0];
          const playerName = text.split(" ")[0];

          if(this.GetCurrentPlayerName() != playerName){
            this.notificationHandler.sendApNotification(-1, text, false, true);
          }
          break;
      case "Tutorial":
        //Do nothing
        break;
      default:
        console.warn("Unhandled message type", packet);
    }
  }

  handleItems(packet : any){
      console.log("Getting new items. Old item index is ", this.itemHandler.lastRecievedItemIndex);
      if (packet.index == 0) {
        //Sync package

        let lastRecievedItemIndex = this.itemHandler.lastRecievedItemIndex;

        if(lastRecievedItemIndex == -1){
          lastRecievedItemIndex = 0;
        }

        for(let i = lastRecievedItemIndex; i < packet.items.length; i++){
          let item = packet.items[i];

          this.handleReceivedItem(item.item, item.player);
        }

        this.itemHandler.updateItemIndex(packet.items.length);
      }
      else{
        let lastRecievedItemIndex = this.itemHandler.lastRecievedItemIndex;

        if(lastRecievedItemIndex == -1){
          lastRecievedItemIndex = 0;
        }

        for (let i = 0; i < packet.items.length; i++) {
          let item = packet.items[i];

          this.handleReceivedItem(item.item, item.player);
        }

        this.itemHandler.updateItemIndex(lastRecievedItemIndex + packet.items.length + 1);
      }
  }

  handleReceivedItem(id : number, player : string){
    if (this.itemHandler.receiveItem(id))
      {
        let message = "";
        let itemName = this.client.items.name(this.connectionInfo.game, id);

        if(this.GetCurrentPlayerId() == player){
          message = "Found " + itemName + "!"; 
        }
        else{
          message = "Recieved " + itemName + " from "+ this.client.players.name(player) + "!"; 
        }
        
        this.notificationHandler.sendApNotification(id, message, true, true);
      }
  }

  handleDeathLink(packet : any){
    game.combat.player.hitpoints = 0;
  }

  diconnected(){
    this.modService.onDisconnect();
  }

  GetCurrentPlayerId(){
    return this.client.data.slot;
  }

  GetCurrentPlayerName(){
    return this.client.players.name(this.GetCurrentPlayerId());
  }
}