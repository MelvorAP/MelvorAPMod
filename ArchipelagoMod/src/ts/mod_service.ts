import { ConnectionHandler } from "./handlers/connection_handler";
import { Items } from "./data/items";
import { ItemHandler } from "./handlers/item_handler";
import { NotificationHandler } from "./handlers/notification_handler";
import { SkillHandler } from "./handlers/skill_handler";
import { SlotdataHandler } from "./handlers/slotdata_handler";
import { SettingsManager } from "./settings_manager";
import { ArchipelagoRequirement } from "./ap_classes/archipelago_requirement";

export interface IModServiceData {
  icon_url: string;
  icon_url_large: string;
  sidebar_category_name?: string;
  sidebar_item_name?: string;
}

export class ModServiceData implements IModServiceData {
  #icon_url: string;
  #icon_url_large: string;
  sidebar_category_name?: string;
  sidebar_item_name?: string;

  constructor(cfg: IModServiceData) {
    ({
      icon_url: this.#icon_url,
      icon_url_large: this.#icon_url_large,
      sidebar_category_name: this.sidebar_category_name,
      sidebar_item_name: this.sidebar_item_name
    } = cfg);
  }

  get icon_url() {
    return this.#icon_url;
  }

  get icon_url_large() {
    return this.#icon_url_large;
  }

  get logo_html() {
    return `<img class="mod-template__logo-img" src="${this.icon_url_large}" />`;
  }
}

export type ModServiceConfig<TCreateSidebar = boolean> =
  (TCreateSidebar extends true
    ? {
        create_sidebar: TCreateSidebar;
        sidebar_category_name: string;
        sidebar_item_name: string;
      }
    : {
        create_sidebar: TCreateSidebar;
      }) & { icon_url: string; icon_url_large: string; log_prefix: string };

export default class ModService {
  #ctx: ModContext;
  #data: ModServiceData;
  #log: (msg: any, ...opts: any[]) => void;

  isArchipelagoGameMode : boolean = false;

  items: Items;

  connectionHandler: ConnectionHandler;
  notificationHandler: NotificationHandler;

  slotdataHandler: SlotdataHandler;
  itemHandler: ItemHandler;
  skillHandler: SkillHandler;

  settingsManager: SettingsManager;
  bar?: SidebarCategoryWrapper;

  private constructor(ctx: ModContext, cfg: ModServiceConfig) {
    this.#ctx = ctx;
    this.#data = new ModServiceData(cfg);

    this.#log = (msg: any, ...opts: any[]) => {
      console.log(`[${cfg.log_prefix}] ${msg}`, ...opts);
    };

    this.slotdataHandler = new SlotdataHandler();

    this.items = new Items();
    this.skillHandler = new SkillHandler(this.items, this.#data.icon_url);
    this.itemHandler = new ItemHandler(this.skillHandler);
  
    this.notificationHandler = new NotificationHandler(this.#data.icon_url, this.#data.icon_url_large);
    this.settingsManager = new SettingsManager(ctx);
    this.connectionHandler = new ConnectionHandler(this, this.itemHandler, this.notificationHandler, this.slotdataHandler, this.settingsManager);
  }

  setSideBar(categoryName : string, itemName : string){
    if(this.bar){
      this.bar.remove();
    }

    const self = this;
      
    this.bar = sidebar.category(
      categoryName,
      { 
        before: "Combat", toggleable: false 
      },
      (bar) => {     
        bar.item(itemName, {
            icon: this.#data.icon_url,
          onClick() {
            if(itemName == "Disconnected"){
              self.connectionHandler.connectToAP();
            }
            else{
              self.connectionHandler.disconnect();
            }
          }
        });
      }
    );
  }

  public onConnected(){
    this.setSideBar(this.#data.sidebar_category_name ?? "", "Connected");
  }

  public onDisconnect(){
    this.setSideBar(this.#data.sidebar_category_name ?? "", "Disconnected");
  }

  static init(ctx: ModContext, cfg: ModServiceConfig) {
    const service = new ModService(ctx, cfg);

    service.#log("Intializing AP Mod...");

    service.#ctx.onModsLoaded(ctx => {
      // @ts-ignore
      ctx.patch(Game, "getRequirementFromData").after(function (_requirement, data) {return service.addApUnlock(data)});
    })
  
    ctx.onCharacterLoaded(async ctx => {
      service.isArchipelagoGameMode = game.currentGamemode.id == "archipelago:apGameMode";

      service.#log("Gamemode is", game.currentGamemode.id);
  
      if(!service.isArchipelagoGameMode){
        return;
      }

      service.skillHandler.setCharacterStorage(ctx.characterStorage);
      service.itemHandler.setCharacterStorage(ctx.characterStorage);
  
      service.skillHandler.lockSkills();
    })
  
    service.#ctx.onInterfaceReady(ctx  => {
      if(!service.isArchipelagoGameMode){
        return;
      }

      if (cfg.create_sidebar){
          service.setSideBar(cfg.sidebar_category_name, cfg.sidebar_item_name);
      }
  
      service.skillHandler.loadUnlockedSkills();
    
      service.connectionHandler.setConnectionInfo();
  
      //game.combat.on("monsterKilled", function (e) {console.log("Monster killed:", e)})
      //game.combat.on("dungeonCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("strongholdCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("abyssDepthCompleted", function (e) {console.log("Abyss completed:", e)})
  
      //game.astrology.on("levelChanged", function (e) {console.log(e.skill, "leveled up from", e.oldLevel, " to ", e.newLevel)})
      //game.astrology.on("masteryLevelChanged", function (e) {console.log(e.action, "leveled up from", e.oldLevel, " to ", e.newLevel)})
  
      service.notificationHandler.showApModal("", "");
      //ctx.notificationHandler.showSkillModal("TITLE", "MESSAGE", "attack");
  
      //game.woodcutting.modifyData({trees: [{id: "melvorD:Normal", requirements: {add: [{type: "ArchipelagoUnlock", itemId: "melvorD:Normal", itemType: "melvorD:Woodcutting"}]}}]})
      //woodcuttingMenu.treeMenus.get(game.woodcutting.actions.getObjectByID("melvorD:Normal")).setTree(game.woodcutting.actions.getObjectByID("melvorD:Normal"), game.woodcutting);
      //woodcuttingMenu.updateTreeUnlocks();

      //game.woodcutting.renderQueue.treeUnlocks = true;
      
      //game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent("melvorD:Normal"));
    });
  }

  addApUnlock(data : any) {
    if(data.type == "ArchipelagoUnlock")
      return new ArchipelagoRequirement(data, game);
  };
}
