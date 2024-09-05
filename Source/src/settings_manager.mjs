let settings = null;

export function setup(ctx){
    settings = ctx.settings;
    
    const apConnection = settings.section("Connection");

    apConnection.add({
      type: "text",
      name: "ap-hostname",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    });

    apConnection.add({
      type: "number",
      name: "ap-port",
      label: "Port",
      hint: "Port of the AP world",
      default: 1,
      min: 1,
      max: 65535
    });
  
    apConnection.add({
      type: "text",
      name: "ap-slotname",
      label: "Slot name",
      hint: "Slot name of the player, for example Player1",
      default: "Player1"
    });
  
    apConnection.add({
      type: "text",
      name: "ap-password",
      label: "Password",
      hint: "Password of the AP room",
      default: ""
    });
}