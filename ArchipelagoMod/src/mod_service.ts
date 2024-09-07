const { loadModule } = mod.getContext(import.meta);

const { ArchipelagoRequirement } = await loadModule( "src/ap_classes/archipelago_requirement.mjs");
const { ArchipelagoItemsChangedEvent } = await loadModule("src/ap_classes/archipelago_items_changed_event.mjs");

const { Items } = await loadModule( "src/data/items.js");

const { ConnectionHandler } = await loadModule( "src/handlers/connection_handler.js");
const { ItemHandler } = await loadModule( "src/handlers/item_handler.js");
const { NotificationHandler } = await loadModule( "src/handlers/notification_handler.js");
const { SettingsManager } = await loadModule( "src/handlers/settings_manager.js");
const { SkillHandler } = await loadModule( "src/handlers/skill_handler.js");
const { SlotdataHandler } = await loadModule( "src/handlers/slotdata_handler.js");

export interface IModServiceData {
  icon_url: string;
  icon_url_large: string;
  sidebar_category_name?: string;
  sidebar_item_name?: string;
}

export class ModServiceData implements IModServiceData {
  #icon_url: string;
  #icon_url_large: string;
  #sidebar_category_name?: string;
  #sidebar_item_name?: string;

  constructor(cfg: IModServiceData) {
    ({
      icon_url: this.#icon_url,
      icon_url_large: this.#icon_url_large,
      sidebar_category_name: this.#sidebar_category_name,
      sidebar_item_name: this.#sidebar_item_name
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

  get sidebar_category_name() {
    return this.#sidebar_category_name;
  }

  get sidebar_item_name() {
    return this.#sidebar_item_name;
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

  private constructor(ctx: ModContext, cfg: ModServiceConfig) {
    this.#ctx = ctx;
    this.#data = new ModServiceData(cfg);

    this.#log = (msg: any, ...opts: any[]) => {
      console.log(`[${cfg.log_prefix}] ${msg}`, ...opts);
    };

    this.slotdataHandler = new SlotdataHandler();

    this.items = new Items();
    this.skillHandler = new SkillHandler(this.items, ctx.characterStorage, this.#data.icon_url_large);
    this.itemHandler = new ItemHandler(this.skillHandler, ctx.characterStorage);
  
    this.notificationHandler = new NotificationHandler(ctx);
    this.settingsManager = new SettingsManager(ctx);
    this.connectionHandler = new ConnectionHandler(this.itemHandler, this.notificationHandler, this.slotdataHandler, this.settingsManager);
  }

  #sidebar_init(cfg: ModServiceConfig) {
    if (cfg.create_sidebar) {
      this.#log("Creating sidebar...");
      const self = this;
      sidebar.category(
        cfg.sidebar_category_name,
        { before: "Combat", toggleable: false },
        (bar) => {
          bar.item(cfg.sidebar_item_name, {
            icon: this.#data.icon_url,
            onClick() {
              // put your stuff here -- maybe a menu modal?
              self.#log("You clicked the sidebar!");
              SwalLocale.fire({
                iconHtml: self.#data.logo_html,
                title: "Congratulations!",
                text: "You clicked the sidebar!",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yay!"
              });
            }
          });
        }
      );
    }
  }

  // put some code in here

  static init(ctx: ModContext, cfg: ModServiceConfig) {
    const service = new ModService(ctx, cfg);

    service.#log("Intializing AP Mod...");

    service.#ctx.onModsLoaded(ctx => {
      // @ts-ignore
      ctx.patch(Game, "getRequirementFromData").after(function (_requirement, data) {return service.addApUnlock(data)});
    })
  
    ctx.onCharacterLoaded(async ctx => {
      service.isArchipelagoGameMode = game.currentGamemode.id == "apGameMode";
  
      if(!service.isArchipelagoGameMode){
        return;
      }
  
      service.skillHandler.lockSkills();
    })
  
    service.#ctx.onInterfaceReady(ctx  => {
      if(!service.isArchipelagoGameMode){
        return;
      }

      if (cfg.create_sidebar){
          service.#sidebar_init(cfg);
      }
  
      service.skillHandler.loadUnlockedSkills();
    
      service.connectionHandler.setConnectionInfo();
      service.connectionHandler.connectToAP(); 
  
      //game.combat.on("monsterKilled", function (e) {console.log("Monster killed:", e)})
      //game.combat.on("dungeonCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("strongholdCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("abyssDepthCompleted", function (e) {console.log("Abyss completed:", e)})
  
      //game.astrology.on("levelChanged", function (e) {console.log(e.skill, "leveled up from", e.oldLevel, " to ", e.newLevel)})
      //game.astrology.on("masteryLevelChanged", function (e) {console.log(e.action, "leveled up from", e.oldLevel, " to ", e.newLevel)})
  
      //ctx.notificationHandler.showApModal("", "");
      //ctx.notificationHandler.showSkillModal("TITLE", "MESSAGE", "attack");
  
      //game.woodcutting.modifyData({trees: [{id: "melvorD:Normal", requirements: {add: [{type: "ArchipelagoUnlock", itemId: "melvorD:Normal", itemType: "melvorD:Woodcutting"}]}}]})
      //woodcuttingMenu.treeMenus.get(game.woodcutting.actions.getObjectByID("melvorD:Normal")).setTree(game.woodcutting.actions.getObjectByID("melvorD:Normal"), game.woodcutting);
      //woodcuttingMenu.updateTreeUnlocks();

      //game.woodcutting.renderQueue.treeUnlocks = true;
      
      game._events.emit('apItemsChangedEvent', new ArchipelagoItemsChangedEvent("melvorD:Normal"));
    });
  }

  addApUnlock(data : any) {
    if(data.type == "ArchipelagoUnlock")
      return new ArchipelagoRequirement(data, game, this.skillHandler, this.#data.icon_url);
  };
}
