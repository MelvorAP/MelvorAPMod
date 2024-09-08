import ModService from "./mod_service";

import "../css/styles.css";
import Icon from "../img/icon.png";
import LargeIcon from "../img/iconLarge.png";
import Gamemode from "../data/gamemode.json";

import RequirementTemplate from "../templates/RequirementTemplate.html";

export async function setup(ctx : ModContext) {
  await ctx.gameData.addPackage(Gamemode);
  await ctx.loadTemplates(RequirementTemplate);

  ModService.init(ctx, {
    icon_url: ctx.getResourceUrl(Icon),
    icon_url_large: ctx.getResourceUrl(LargeIcon),
    log_prefix: "archipelago", // set your own prefix
    create_sidebar: true, // if this is true you need to provide sidebar_category_name and sidebar_item_name
    sidebar_category_name: "Archipelago",
    sidebar_item_name: "Disconnected"
  });
}