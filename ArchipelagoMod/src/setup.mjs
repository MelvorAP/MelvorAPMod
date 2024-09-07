const { loadModule } = mod.getContext(import.meta);

const { ModService } = await loadModule("src/mod_service.js");

export async function setup(ctx) {
  ctx.loadStylesheet('/css/styles.css');

  ModService.init(ctx, {
    icon_url: ctx.getResourceUrl("/img/icon.png"),
    icon_url_large: ctx.getResourceUrl("/img/icon_large.png"),
    log_prefix: "archipelago", // set your own prefix
    create_sidebar: true, // if this is true you need to provide sidebar_category_name and sidebar_item_name
    sidebar_category_name: "Mod Template Category",
    sidebar_item_name: "Click me"
  });
}