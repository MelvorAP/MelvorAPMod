export interface SettingsSection {
    get: (name: string) => unknown;
    set: (name: string, value: any) => void;
    add: (config: SettingConfig | SettingConfig[]) => void;
};

export class SettingsManager{
  apConnectionSection : SettingsSection = {} as SettingsSection;

  constructor(ctx: ModContext){
    this.apConnectionSection = ctx.settings.section("Connection");

    var settings : SettingConfig[] = [];

    settings.push({
      type: "text",
      name: "ap-hostname",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    } as SettingConfig)

    settings.push({
      type: "number",
      name: "ap-port",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    } as SettingConfig)

    settings.push({
      type: "text",
      name: "ap-slotname",
      label: "Slot name",
      hint: "Slot name of the player, for example Player1",
      default: "Player1"
    } as SettingConfig)

    settings.push({
      type: "text",
      name: "ap-password",
      label: "Password",
      hint: "Password of the AP room",
      default: ""
    } as SettingConfig);

    settings.push({
      type: "switch",
      name: "ap-auto-connect",
      label: "Auto connect",
      hint: "Automatically connect to the room when character is loaded.",
      default: false
    } as SettingConfig);

      this.apConnectionSection.add(settings);
  }
}