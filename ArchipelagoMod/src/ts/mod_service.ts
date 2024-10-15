import { ConnectionHandler } from "./handlers/connection_handler";
import { Items } from "./data/items";
import { ItemHandler } from "./handlers/item_handler";
import { NotificationHandler } from "./handlers/notification_handler";
import { SkillHandler } from "./handlers/skills/skill_handler";
import { SlotdataHandler } from "./handlers/slotdata_handler";
import { SettingsManager } from "./settings_manager";
import { ArchipelagoRequirement } from "./ap_classes/archipelago_requirement";
import { ActionHandler } from "./handlers/skills/action_handler";

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
  actionHandler : ActionHandler;

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

    this.notificationHandler = new NotificationHandler(this.#data.icon_url, this.#data.icon_url_large);
    this.settingsManager = new SettingsManager();

    this.skillHandler = new SkillHandler(this.items);
    this.actionHandler = new ActionHandler(this.skillHandler, this.notificationHandler, this.items, this.#data.icon_url);
    this.itemHandler = new ItemHandler(this.items, this.skillHandler, this.slotdataHandler);
  

    this.connectionHandler = new ConnectionHandler(this, this.itemHandler, this.notificationHandler, this.slotdataHandler);
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
              self.connectionHandler.setConnectionInfo(self.settingsManager);
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

    if(this.slotdataHandler.apSettings.removeSkillActionLevels){
      this.actionHandler.setLevelsToLowest();
    }
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
      // @ts-ignore
      ctx.patch(Farming, "modifyData").after(function (data) {return service.farmingModifyData(data)});

      // @ts-ignore
      ctx.patch(SidebarItem, 'click').replace(function(o) {
        console.log("test");
        // @ts-ignore
        if (this.id === 'melvorD:Combat' && service.isArchipelagoGameMode && ! service.skillHandler.hasAnyCombat()){
          service.notificationHandler.showSkillModal(
            "You don't have any combat skill", 
            'You need to find ${0}Attack, ${1}Strength, ${2}Ranged or<br>${3}Magic in the ${4}AP World to do combat.', 
            "combat",
            [
              "https://cdn2-main.melvor.net/assets/media/skills/combat/attack.png",
              "https://cdn2-main.melvor.net/assets/media/skills/combat/strength.png",
              "https://cdn2-main.melvor.net/assets/media/skills/ranged/ranged.png",
              "https://cdn2-main.melvor.net/assets/media/skills/magic/magic.png",
              service.#data.icon_url
            ]
          );
          return;
        }
        else{
          o();
        }
      });

      service.settingsManager.setup(ctx);
    })
  
    ctx.onCharacterLoaded(async ctx => {
      service.isArchipelagoGameMode = game.currentGamemode.id == "archipelago:apGameMode";

      service.#log("Gamemode is", game.currentGamemode.id);
  
      if(!service.isArchipelagoGameMode){
        return;
      }

      service.skillHandler.setCharacterStorage(ctx.characterStorage);
      service.actionHandler.setCharacterStorage(ctx.characterStorage);
      service.itemHandler.setCharacterStorage(ctx.characterStorage);
  
      service.skillHandler.lockSkills(service.actionHandler);
    })
  
    service.#ctx.onInterfaceReady(ctx  => {
      if(!service.isArchipelagoGameMode){
        return;
      }

      if (cfg.create_sidebar){
          service.setSideBar(cfg.sidebar_category_name, cfg.sidebar_item_name);
      }
  
      service.skillHandler.loadUnlockedSkills();
    
      service.connectionHandler.setConnectionInfo(service.settingsManager);

      if(Boolean(service.settingsManager.apConnectionSection.get("ap-auto-connect"))){
        service.connectionHandler.connectToAP();
      }
  
      //game.combat.on("monsterKilled", function (e) {console.log("Monster killed:", e)})
      //game.combat.on("dungeonCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("strongholdCompleted", function (e) {console.log("Dungeon completed:", e)})
      //game.combat.on("abyssDepthCompleted", function (e) {console.log("Abyss completed:", e)})
  
      //game.astrology.on("levelChanged", function (e) {console.log(e.skill, "leveled up from", e.oldLevel, " to ", e.newLevel)})
      //game.astrology.on("masteryLevelChanged", function (e) {console.log(e.action, "leveled up from", e.oldLevel, " to ", e.newLevel)})
  
      
    });
  }

  addApUnlock(data : any) {
    if(data.type == "ArchipelagoUnlock")
      return new ArchipelagoRequirement(data, game);
  };

  farmingModifyData(data : any) {
    var _a;
    (_a = data.seeds) === null ||
    _a === void 0 ? void 0 : _a.forEach(
      (modData : any) => {
        const seed = game.farming.actions.getObjectByID(modData.id);
        if (seed === undefined)
          throw new UnregisteredDataModError(FarmingRecipe.name, modData.id);
        // @ts-ignore
        seed.applyDataModification(modData, this.game);
      }
    );
  }
}
